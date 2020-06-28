<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\FileWorker\Fileworker;
use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Custom\ProjectRequest;
use App\Mail\NewsMailer;
use App\Models\Background;
use App\Models\Client;
use App\Models\Customer;
use App\Models\Timeline;
use App\Models\News;
use App\Models\Project;
use App\Repository\BackgroundRepository;
use App\Repository\FolderRepository;
use App\Repository\GroupRepositiry;
use App\Repository\ImageRepository;
use App\Repository\NewsRepository;
use App\Repository\ProjectRepo;
use App\Repository\SubscribersRepository;
use App\Repository\TimelineRepository;
use App\Twilio\SMSSender;
use App\Twilio\WhatsupSender;
use App\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use SoapClient;
use Auth;
use App\Sms;
use App\Phone;

class ProjectController extends Controller
{

    public function index()
    {
        $projectRepo = new ProjectRepo();
        $subsRepo = new SubscribersRepository();
        $newsRepo = new NewsRepository();
        $user = User::auth();
        $client = Client::find(Helper::getClientId());
        
        if($user->type == 0) {
            $projects = $projectRepo->getAllProjectShortForAdmin();
            $package = null;
        } else {
            if ($user->type == 1) {
                $package = null;
                $projects = $projectRepo->getAllProjectShort($user->client_id, ['id', 'project_name', 'timeline', 'is_published']);
            } else {
                $package = null;
                $projects = $projectRepo->getProjectForCustomer($user->project_id);
            }
        }        

        foreach ($projects as &$project) {
            /**
             * @var Project $project
             */
            $project['last_news'] = $newsRepo->getLastNewsShort($project->id);

            if (is_null($project->timeline)) {
                $project->current_step = null;
                $project->step_name = null;
                unset($project->timeline);
                continue;
            }

            if (!array_key_exists('current_step', $project->timeline)) {
                $project->current_step = null;
                $project->step_name = null;
                unset($project->timeline);
                continue;


            }
            $project->current_step = $project->timeline['current_step'];

            if (array_key_exists('steps', $project->timeline)) {

                if (array_key_exists($project->current_step - 1, $project->timeline['steps'])) {

                    $project->step_name = $project->timeline['steps'][$project->current_step - 1]['step_name'];
                    unset($project->timeline);
                    continue;

                }

            }
            $project->current_step = null;
            $project->step_name = null;
            unset($project->timeline);
        }

        $user_info = [
            'access_level' => $user->type,
            'user_name' => $user->name,
            'client_id' => ($client ? $client->id : null),
            'current_subscribers' => $subsRepo->countSubsForClient(Helper::getClientId()),
            'total_subscribers' => ($package ? $package->max_subscribers : null),
            'package_name' => ($package ? $package->name : null),
            'current_projects' => count($projects),
            'total_projects' => ($package ? $package->max_projects : null)
        ];

        $response = [
            'user_info' => $user_info,
            'data' => ['projects' => $projects,]
        ];

        return response()->json($response);
    }

    public function projectByClient(ProjectRequest $request, $id) {
        $projectRepo = new ProjectRepo();
        $projects = $projectRepo->getAllProjectShort($id, ['id', 'project_name']);
        $response = [
            'data' => $projects
        ];

        return response()->json($response);
    }

    public function newsByClient(ProjectRequest $request, $id) {
        $newsRepo = new NewsRepository();
        $news = $newsRepo->getAllNewsByClient($id);
        $response = [
            'data' => $news
        ];
        return response()->json($response);
    }


    

    public function create(ProjectRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'project_name' => 'string|min:3|max:200',
            'city' => 'string|min:3|max:200',
            'client_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // $project->client_id = Helper::getClientId();
        // $project->background = Background::$default;

        $project = Project::create([
            'project_name' => $request->project_name,
            'client_id' => $request->client_id,
            'city' => $request->city,
            'remind' => $request->remind,
            'remind_period' => $request->remind_period,
            'remind_message' => $request->remind_message,
            'subdivision' => json_encode($request->subdivision),
            'backgrounds' => json_encode($request->newbackgrounds),
            'logoes' => json_encode($request->newlogoes),
            'gallery' => json_encode($request->newgallery),
            'url_link' => $request->url_link,
        ]);
        // $bgr = new BackgroundRepository();

        return response()->json(['status'=>true, 'data'=> $project], 200);
    }

    public function duplicate(int $id)
    {
        $projectRepo = new ProjectRepo();
        $oldProject = $projectRepo->getDuplicateData($id);
        if ($oldProject->client_id != Auth::user()->client_id) {
            return Error::access_denied();
        }

        $project = new Project();
        $project->client_id = $oldProject->client_id;
        $project->project_name = $oldProject->project_name . '_copy';
        $project->city = $oldProject->city;
        $project->timeline_id = $oldProject->timeline_id;
        $project->steps = $oldProject->steps;
        $project->remind = $oldProject->remind;
        $project->remind_message = $oldProject->remind_message;
        $project->remind_next_date = $oldProject->remind_next_date;
        $project->remind_period = $oldProject->remind_period;
        $project->subdivision = $oldProject->subdivision;
        $project->backgrounds = $oldProject->backgrounds;
        $project->logoes = $oldProject->logoes;
        $project->gallery = $oldProject->gallery;
        $project->is_published = $oldProject->is_published;
        $project->project_link = $oldProject->project_link;
        $project->updates = $oldProject->updates;
        $project->url_link = $oldProject->url_link;
        
        $project->save();
        return response()->json(['id' => $project->id, 'data' => $project]);

    }

    public function getPart(ProjectRequest $request, $id)
    {

        if (is_null($project = Project::find($id))) {
            return Error::project_not_found();
        }

        switch ($request->part) {
            case 1:
                $bgr = new BackgroundRepository();
                $ir = new ImageRepository();
                $arr = [
                    'project_name' => $project->project_name,
                    'address' => $project->address,
                    'address2' => $project->address2,
                    'city' => $project->city,
                    'remind' => $project->remind,
                    'remind_period' => $project->remind_period,
                    'remind_message' => $project->remind_message,
                    'background' => $project->background,
                    'images' => $ir->getProjectImage($id),
                    'project_link' => $project->project_link,
                ];

                return response()->json(['id' => $project->id, 'bg' => $bgr->getAllBGID(), 'data' => $arr]);

            case 2:
                $tr = new TimelineRepository();
                $arr = [
                    'timeline' => $project->timeline,
                    'timelineTemplates' => $tr->getTimelines(Helper::getClientId())
                ];
                return response()->json(['id' => $project->id, 'data' => $arr]);

            case 3:
                $fr = new FolderRepository();
                $arr = [
                    'folders' => $fr->getProjectFolders($project->id),
                ];
                return response()->json(['id' => $project->id, 'data' => $arr]);

            case 4:
                $sr = new SubscribersRepository();
                $gr = new GroupRepositiry();
                $arr = [
                    'subscribers' => $sr->projectSubscribers($project->id),
                    'groups' => $gr->getGroups(Helper::getClientId()),
                ];
                return response()->json(['id' => $project->id, 'data' => $arr]);

            default:
                return response()->json('bad request from default', 400);
        }
    }

    public function show(int $id)
    {
        $projectRepo = new ProjectRepo();
        $project = $projectRepo->getProjectForClient($id);
        $project['steps'] = json_decode($project['steps']);
        return response()->json($project, 200);
    }

    public function update(ProjectRequest $request, int $id)
    {
        $project = Project::find($id);

        if($request->project_name)
            $project->project_name = $request->project_name;
        if($request->client_id)
            $project->client_id = $request->client_id;       
        if($request->remind)
            $project->remind = $request->remind;
        if($request->remind_period)
            $project->remind_period = $request->remind_period;
        if($request->remind_message)
            $project->remind_message = $request->remind_message;
        if($request->subdivision)
            $project->subdivision = json_encode($request->subdivision);
        if($request->newbackgrounds)
            $project->backgrounds = json_encode($request->newbackgrounds);
        if($request->newlogoes)
            $project->logoes = json_encode($request->newlogoes);
        if($request->newgallery)
            $project->gallery = json_encode($request->newgallery);
        if($request->timeline_id)
            $project->timeline_id = $request->timeline_id ;
        if($request->steps)
            $project->steps = json_encode($request->steps);
        if($request->current_status)
            $project->current_status = $request->current_status;
        if($request->url_link)
            $project->url_link = $request->url_link;
        if($request->city)
            $project->city = $request->city;
        
        $project->save();
        
        return response()->json('done', 200);


    }


    public function delete(int $id)
    {
        $project = Project::find($id);
        if (is_null($project)) {
            return Error::project_not_found();
        }
        // if ($project->client_id != Helper::getClientId()) {
        //     return Error::access_denied();
        // }
        $subs = Customer::where('project_id', $project->id)->get();
        $user_id = [];
        foreach ($subs as $sub) {
            $user_id[] = $sub['id'];
        }

        try {
            DB::beginTransaction();
            User::whereIn('customer_id', $user_id)->delete();
            DB::commit();
        } catch (Exception $exception) {
            DB::rollBack();
            return response()->json($exception->getMessage(), 527);
        }
        try {
            $project->delete();
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 527);
        }
        return response()->json('ok', 200);
    }

    public function sendNews(ProjectRequest $request, $id)
    {
        $subs = Customer::with('user')
            ->whereIn('id', $request->subscribers)
            ->get();
        $users = $subs->pluck('user');

        $answer = [];
        if ($request->has('title')) {
            $title = $request->title;
        } else {
            $title = 'כותרת';
        }

        // dd($request->emailMessage);

        if ($request->email) {
            if ($request->file()) {
                $data['attached'] = $request->file();
            }
            $data['message'] = $request->emailMessage;
            $data['subject'] = $title;
            $count = 0;
            foreach ($users as $user) {
                $data['user_name'] = $user->name;
                $data['user_email'] = $user->email;
                Mail::to($user->email)->send(new NewsMailer($data));
                $count++;
            }
            $answer['emails_sent'] = $count;

        }

        if ($request->sms) {
            $data = $request->smsMessage;
            $count = 0;

            foreach ($users as $user) {
/*
                $url = "https://019sms.co.il/api";
                $xml ='
                <?xml version="1.0" encoding="UTF-8"?>
                <sms>
                <user>
                <username>019sms</username>
                <password>210120</password>
                </user>
                <source>019</source>
                <destinations>
                <phone id="12">+917737121955</phone>
                </destinations>
                <message>This is an example</message>
                </sms>';
                $CR = curl_init();
                curl_setopt($CR, CURLOPT_URL, $url);
                curl_setopt($CR, CURLOPT_POST, 1);
                curl_setopt($CR, CURLOPT_FAILONERROR, true);
                curl_setopt($CR, CURLOPT_POSTFIELDS, $xml);
                curl_setopt($CR, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($CR, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($CR, CURLOPT_HTTPHEADER, array("charset=utf-8"));
                $result = curl_exec($CR);
                // $error = curl_error($CR);
                // if (!empty($error))
                // die("Error: " . $error);
                // else
                // dd($result);

*/
                $count++;
            }
            $answer['sms_sent'] = $count;
        }

        if ($request->whatsapp) {
            $data = $request->whatsappMessage;
            $count = 0;
            // $whatsapp = new WhatsupSender($data);
            // foreach ($users as $user) {
            //     $whatsapp->to($user)->send();
            //     $count++;
            // }
            $answer['whatsup_sent'] = $count;
        }
        if (!$answer) {
            $answer = 'nothing to send';
        }


        if ($request->email) {
            $news_body = $request->emailMessage;
        } else if ($request->sms) {
            $news_body = $request->smsMessage;
        } else if ($request->whatsapp) {
            $news_body = $request->whatsappMessage;
        } else {
            return Error::incomplete_data();
        }
        $news = new News();
        $news->project_id = $id;
        $news->client_id = $request->client_id;
        $news->title = $title;
        $news->body = $news_body;
        $news->publish_time = Carbon::now();
        $news->save();
        return response()->json($answer, 201);
    }


    public function updateNewsTime(ProjectRequest $request, $id)
    {
        $item = News::where('id', $id)->first();
        if ($item) {
            $item->publish_time = Carbon::parse($request->publish_time);
            $item->save();
            return response()->json($item, 200);
        }
        return response()->json(['error' => 'News item not found'], 422);
    }

    public function updateNewsItem(ProjectRequest $request, $id)
    {
        $item = News::where('id', $id)->first();
        if ($item) {
            $data = json_decode($request->getContent(), false);
            try {
                if (property_exists($data, 'new_date_time')) {
                    $newDate = Carbon::parse($data->new_date_time);
                    $item->publish_time = $newDate;
                    $item->created_at = $newDate;
                    $item->updated_at = $newDate;
                } elseif (property_exists($data, 'new_contents')) {
                    $item->body = $data->new_contents;
                }
                $item->save();
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 422);
            }
            return response()->json($data, 201);
        }
        return response()->json(['error' => 'News item not found'], 422);
    }

    public function insertImage(ProjectRequest $request) {
        $request->validate([
            'image' => 'required|mimes:png,jpg,jpeg',
        ]);
        $fileName = time().'.'.$request->image->extension();  
        try {
            $request->image->move(public_path('uploads'), $fileName);        
        } catch (\Throwable $th) {
            //throw $th;
        }
        return response()->json(['status'=>true, 'fileName'=>$fileName], 200);
    }

    public function search(ProjectRequest $request)
    {
        $projectRepo = new ProjectRepo();
        $subsRepo = new SubscribersRepository();
        $newsRepo = new NewsRepository();
        $user = User::auth();
        $client = Client::find(Helper::getClientId());
        
        if($user->type == 0) {
            $projects = $projectRepo->getAllProjectShortSearch($request->manager_id, $request->searchVal);
            $package = null;
        } else {
            if ($user->type == 1) {
                $package = null;
                $projects = $projectRepo->getAllProjectShortSearch($user->client_id, $request->searchVal);
            } else {
                $package = null;
                $projects = $projectRepo->getProjectForCustomer($user->project_id);
            }
        }        

        foreach ($projects as &$project) {
            /**
             * @var Project $project
             */
            $project['last_news'] = $newsRepo->getLastNewsShort($project->id);

            if (is_null($project->timeline)) {
                $project->current_step = null;
                $project->step_name = null;
                unset($project->timeline);
                continue;
            }

            if (!array_key_exists('current_step', $project->timeline)) {
                $project->current_step = null;
                $project->step_name = null;
                unset($project->timeline);
                continue;


            }
            $project->current_step = $project->timeline['current_step'];

            if (array_key_exists('steps', $project->timeline)) {

                if (array_key_exists($project->current_step - 1, $project->timeline['steps'])) {

                    $project->step_name = $project->timeline['steps'][$project->current_step - 1]['step_name'];
                    unset($project->timeline);
                    continue;

                }

            }
            $project->current_step = null;
            $project->step_name = null;
            unset($project->timeline);
        }

        $user_info = [
            'access_level' => $user->type,
            'user_name' => $user->name,
            'client_id' => ($client ? $client->id : null),
            'current_subscribers' => $subsRepo->countSubsForClient(Helper::getClientId()),
            'total_subscribers' => ($package ? $package->max_subscribers : null),
            'package_name' => ($package ? $package->name : null),
            'current_projects' => count($projects),
            'total_projects' => ($package ? $package->max_projects : null)
        ];

        $response = [
            'user_info' => $user_info,
            'data' => ['projects' => $projects,]
        ];

        return response()->json($response);
    }
}
