<?php

namespace App\Http\Controllers\Api;

use App\AccessController\AccessController;
use App\Errors\Error;
use App\Http\Controllers\Controller;
use App\Models\Filelist;
use App\Models\Folder;
use App\Repository\FileRepository;
use App\Repository\FolderRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Auth;

class FolderController extends Controller
{
    public function projectFolders(Request $request, $project_id)
    {
        $user = Auth::user();

        if($user->type == 3) {
            if($request->type == 'client') {
                $folders = Folder::where('project_id', $project_id)->where('type', 'client')->with('fileList')->get();
            } else {
                $folders = Folder::where('owner_id', $user->id)->where('project_id', $project_id)->where('type', 'customer')->with('fileList')->get();
            }


        } else {
            if($request->type == 'client') {
                $folders = Folder::where('project_id', $project_id)->where('type', 'client')->with('fileList')->get();

            } else {
                $folders = Folder::where('project_id', $project_id)->where('type', 'customer')->with('fileList')->get();
            }


        }

        return response()->json($folders);
    }

 

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|integer',
            'client_id' => 'required|integer',
            'folder_name' => 'string|min:3|max:200'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $valid = $validator->validated();

        // if (AccessController::dontHaveProject($valid['project_id'])) {
        //     return Error::cant_do_this();
        // }

        $folder = Folder::create([
            'project_id' => $valid['project_id'],
            'name' => $valid['folder_name'],
        ]);

        return response()->json($folder->id, 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'folder_name' => 'string|min:5|max:200'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $folder = Folder::find($id);
        if (AccessController::dontHaveProject($folder->project_id)) {
            return Error::access_denied();
        }
        $folder->name = $request->folder_name;
        $folder->save();
        return response()->json('ok', 201);
    }

    public function delete(int $id)
    {
        $folder = Folder::find($id);
        // if (AccessController::dontHaveProject($folder->project_id)) {
        //     return Error::access_denied();
        // }
        try {
            DB::beginTransaction();
            $folder->delete();
            $files = Filelist::where('folder_id', $id)->get();
            foreach ($files as $file) {
                $file->delete();
            }
            DB::commit();
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 527);
        }

        return response()->json('ok', 201);
    }

    public function getFolderZip(int $id)
    {

        $folder_id = $id;
        $folderRepo = new FolderRepository();
        $folder = $folderRepo->getFolder($folder_id);
        if (AccessController::dontHaveProject($folder->project_id)) {
            return Error::access_denied();
        }
        $fileRepo = new FileRepository();
        $fileList = $fileRepo->folderFileList($folder_id);
        if ($fileList->isEmpty()) {
            return response()->json('empty folder', 404);
        }
        //todo заменить пути для зипования папок
        $dir = '/var/www/html/yaron-back/storage/app/temp/' . $fileList->first()->client_id;
        Storage::makeDirectory('temp/' . $fileList->first()->client_id);
        $zip = new \ZipArchive();
        if ($zip->open($dir . '/' . $folder->name . '.zip', \ZipArchive::CREATE) !== TRUE) {
            return response()->json('cant create zip', 527);
        } else {
            foreach ($fileList as $file) {
                $zip->addFile(substr(Storage::url($file->file_path), 1), $file->file_name);

            }
            $zip->close();
            return response()->download($dir . '/' . $folder->name . '.zip')->deleteFileAfterSend(true);
        }
    }
}
