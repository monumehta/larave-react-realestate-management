<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\FileWorker\Fileworker;
use App\Http\Controllers\Controller;
use App\Mail\MailForManager;
use App\Models\Client;
use App\Models\Project;
use App\Models\Remind;
use App\Repository\FileRepository;
use App\Repository\NewsRepository;
use App\Repository\ProjectRepo;
use App\Repository\SubscribersRepository;
use App\Repository\UserRepositiry;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SingleSubscriberController extends Controller
{
    private $projectRepo;
    private $subsRepo;
    private $userRepo;

    public function __construct(ProjectRepo $projectRepo, SubscribersRepository $subscribersRepository, UserRepositiry $userRepositiry)
    {
        $this->projectRepo = $projectRepo;
        $this->subsRepo = $subscribersRepository;
        $this->userRepo = $userRepositiry;
    }

    public function index()
    {
        $projects = [];
        $user = User::auth();
        $newsRepo = new NewsRepository();
        $userProjects = $this->subsRepo->getProjectsIDForUser($user->id);

        foreach ($userProjects as $userProject) {
            /**
             * @var Project $userProject
             */
            $projects[] = [
                'id' => $userProject->id,
                'is_published' => $userProject->is_published,
                'step_name' => $userProject->timeline['steps'][$userProject->current_step - 1]['step_name'],
                'current_step' => $userProject->timeline['current_step'],
                'project_name' => $userProject->project_name,
                'last_news' => $newsRepo->getLastNewsShort($userProject->id),
            ];
        }

        $answer['user_info'] = [
            'access_level' => $user->type,
            'user_name' => $user->name,
            'client_id' => $user->client_id,
        ];
        $answer['projects'] = $projects;

        return response()->json($answer, 200);
    }

    public function show($id)
    {

        if ($this->cantGetProject($id)) {
            return Error::project_not_found();
        }

        $project = $this->projectRepo->getProjectForSub($id);

        return response()->json($project, 200);
    }

    public function sendMessageForManager(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'required|string|max:200|min:1',
            'message' => 'required|string|max:2000|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $valid = $validator->validated();

        $user = User::auth();
        $client = Client::find($user->client_id);
        $client_user = $this->userRepo->getClientUserById($user->client_id);

        $data = [
            'email' => $client->company_email,
            'user_name' => $client_user->name,
            'user_email' => $client_user->email,
            'from_name' => $user->name,
            'from_email' => $user->email,
            'subject' => $valid['subject'],
            'message' => $valid['message'],
            'subject_slug' => str_replace(' ', '%20', $valid['subject'])
        ];

        Mail::send(new MailForManager($data));

        return response()->json('done', 201);
    }

    public function uploadFile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|file|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $fw = new Fileworker();
        return $fw->createFile($request, User::$SUBSCRIBER);
    }

    public function deleteFile(Request $request, $id)
    {
        $fw = new Fileworker();
        return $fw->deleteFile($request, $id);
    }

    public function showFilesInFolder(Request $request)
    {
        $fileRepo = new FileRepository();
        if ($request->folder_id != 'subscriber_folder') {
            $fileList = $fileRepo->folderFileList($request->folder_id);
        } else {
            $fileList = $fileRepo->folderFileListSubs($request->project_id);
        }
        return response()->json($fileList, 200);
    }

    public function createRemind(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:2000|min:1',
            'send_date' => 'required|string|date|size:10',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        Remind::create([
            'user_id' => Auth::id(),
            'message'=> $validator->validated()['message'],
            'send_date' => $validator->validated()['send_date'],
        ]);

        return response()->json('done', 200);
    }

    public function getLogo()
    {
        $client = Client::find(User::auth()->client_id);
        return response()->json(Storage::url($client->company_logo), 200);
    }


    private function cantGetProject(int $id)
    {
        if(is_null($this->subsRepo->getSubForProject($id))){
            return true;
        }
        return false;
    }
}
