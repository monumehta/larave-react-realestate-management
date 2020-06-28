<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\FileWorker\Fileworker;
use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Custom\FileRequest;
use App\Models\Filelist;
use App\Models\Project;
use App\Models\Subscriber;
use App\Repository\FileRepository;
use App\Repository\FolderRepository;
use App\User;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class FileController extends Controller
{
    public function store(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'client_id' => 'required',
            'folder_id' => 'required',
            'project_id' => 'required|integer',
            'file_name' => 'required|string'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $valid = $validator->validated();
        
        if($request->client_upload){
            $folder = Folder::where('project_id', $request->project_id)
                ->where('owner_id', $request->owner_id)->first();

            if(!$folder) {
                $folder = Folder::create([
                    'project_id' => $request->project_id,
                    'owner_id' => $request->owner_id,
                    'name' => $request->name,
                    'type' => 'customer',
                ]);
            }

            $file = Filelist::create([
                'project_id' => $valid['project_id'],
                'folder_id' => $folder->id,
                'client_id' => $valid['client_id'],
                'file_name' => $valid['file_name'],
                'file_path' => $valid['file_name'],
                'owner_id' => $request->owner_id,
            ]);
        } else {
            $file = Filelist::create([
                'project_id' => $valid['project_id'],
                'folder_id' => $valid['folder_id'],
                'client_id' => $valid['client_id'],
                'file_name' => $valid['file_name'],
                'file_path' => $valid['file_name'],
                'owner_id' => $request->owner_id,
            ]);
        }

        

        return response()->json($file, 200);
    }

    public function getFile(int $id)
    {

        $fr = new FileRepository();
        $file = Filelist::find($id);
        if (!$file) {
            return Error::file_not_found();
        }
        $user = User::auth();
        if ($user->type == User::$SUBSCRIBER) {
            $subscriber = Subscriber::where('user_id', $user->id)
                ->first();
            if ($subscriber->project_id != $file->project_id) {
                return Error::access_denied();
            }
        }
        if ($user->type == User::$CLIENT || $user->type == User::$ADMIN) {
            if (Helper::getClientId() != $file->client_id) {
                return Error::access_denied();
            }
        }
        return $fr->getFile($id);
    }

    public function getFile2(int $id)
    {

        $fr = new FileRepository();
        $file = Filelist::find($id);
        if (!$file) {
            return Error::file_not_found();
        }
        $user = User::auth();
        if ($user->type == User::$SUBSCRIBER) {
            $subscriber = Subscriber::where('user_id', $user->id)
                ->first();
            if ($subscriber->project_id != $file->project_id) {
                return Error::access_denied();
            }
        }
        if ($user->type == User::$CLIENT || $user->type == User::$ADMIN) {
            if (Helper::getClientId() != $file->client_id) {
                return Error::access_denied();
            }
        }
        return $fr->getFile2($id);
    }

    public function delete(Request $request, $id)
    {
        // $fw = new Fileworker();
        // return $fw->deleteFile($request, $id);
        $file = Filelist::find($id)->delete();
        return response()->json($file, 200);

    }

    public function getFolderFiles(int $folder_id)
    {
        // $folderRepo = new FolderRepository();
        // $folder = $folderRepo->getFolder($folder_id);
        // if (!$folder) {
        //     return Error::file_not_found();
        // }

        // $projects_id = Project::where('client_id', Helper::getClientId())
        //     ->select('id')
        //     ->get();
        // if (!$projects_id->contains($folder->project_id)) {
        //     return Error::access_denied();
        // }

        $fr = new FileRepository();
        $files = $fr->folderFileList($folder_id);
        return response()->json($files);
    }

    public function getFilesForClient(FileRequest $request, $owner_id)
    {
        $files = Filelist::where('project_id',$request->project_id)
            ->where('owner_id',$owner_id)->get();
        
        return response()->json($files);
    }

    public function getFilesForProject(FileRequest $request, $project_id)
    {
        $files = Filelist::where('project_id',$project_id)
            ->where('folder_id','0')->with('owner')->get();

        return response()->json($files);
    }

    

    public function getSubsFolderFiles(FileRequest $request)
    {
        $project_id = $request->project_id;
        $owner_id = $request->subscriber_id;
        $fr = new FileRepository();
        $files = $fr->folderFileListSubs($project_id, $owner_id);
        return response()->json($files);
    }

    public function updateFileName(FileRequest $request, $id)
    {

        $file = Filelist::find($id);
        $file->file_name = $request->file_name;
        $file->save();
        return response()->json('done', 200);
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




}
