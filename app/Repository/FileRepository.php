<?php


namespace App\Repository;


use App\Errors\Error;
use App\FileWorker\Fileworker;
use App\Models\Filelist as Model;
use App\Models\Filelist;
use App\Models\Subscriber;
use App\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileRepository extends RepoBase
{
    public function __construct()
    {
        parent::__construct();
    }

    function getModelClass()
    {
        return Model::class;
    }

    public function getFile($id)
    {
        $file = $this->startCondition()
            ->select('file_path', 'file_name', 'id')
            ->find($id);
        if ($file) {
            if (Storage::exists($file->file_path)) {
                return Storage::download($file->file_path, $file->file_name);
            } else {
                $delete = Filelist::find($file->id);
                $delete->delete();
                return Error::file_not_found_and_delete();

            }
        } else {
            return Error::file_not_found();
        }
    }

    public function getFile2($id)
    {
        $file = $this->startCondition()
            ->select('file_path', 'file_name', 'id')
            ->find($id);
        if ($file) {
            if (Storage::exists($file->file_path)) {
                return Storage::file($file->file_path, $file->file_name);
            } else {
                $delete = Filelist::find($file->id);
                $delete->delete();
                return Error::file_not_found_and_delete();

            }
        } else {
            return Error::file_not_found();
        }
    }

    public function folderFileList($id):Collection
    {
        $files = $this->startCondition()
            ->where('folder_id', $id)
            ->select(['id','file_name','client_id','file_path'])
            ->get();
        return $files;

    }

    public function folderFileListSubs(int $project_id, int $owner_id = null)
    {
        if(is_null($owner_id)){
            $owner_id = Auth::id();
        }else{
            $sub = Subscriber::find($owner_id);
            $owner_id = $sub->user_id;
        }
        $files = $this->startCondition()
            ->where([
                ['owner_type', '=', User::$SUBSCRIBER],
                ['owner_id', '=', $owner_id],
                ['project_id', '=', $project_id]
            ])
            ->select(['id', 'file_name'])
            ->get();
        return $files;
    }

    public function getAllPath(array $id)
    {
        $url = $this->startCondition()
            ->whereIn('id', $id)
            ->select('file_path', 'file_name')
            ->get();
//            $url = $url->pluck('file_path');
//            $url->flatten();
        return $url;
    }

    public function getSubscriberFolders($project_id)
    {
        $subs = $this->startCondition()
            ->where([
                ['project_id', '=', $project_id],
                ['owner_type', '=', User::$SUBSCRIBER],
            ])
            ->select('owner_id')
//            ->toBase()
            ->get();
        $subs = $subs->pluck('owner_id')->unique()->toArray();

        $userRepo = new UserRepositiry();
        $subname = $userRepo->getSubsNames($subs);
        return $subname;
    }
}