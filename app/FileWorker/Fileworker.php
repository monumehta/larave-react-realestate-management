<?php


namespace App\FileWorker;


use App\Errors\Error;
use App\Helper\Helper;
use App\Models\Background;
use App\Models\Filelist;
use App\Models\Image;
use App\Models\Project;
use App\User;
use http\Env\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class Fileworker extends FileWorkerBase
{

    public function deleteImage($id)
    {
        $image = Image::find($id);
        if ($image) {
            if (Storage::exists($image->url)) {
                Storage::delete($image->url);
            }
            $image->delete();
            return response()->json('ok', 200);
        } else {
            return Error::file_not_found();
        }
    }

    public function createImage($request, $id)
    {
        $project = Project::find($id);
        if (Helper::getClientId() != $project->client_id) {
            return Error::cant_do_this();
        }
        foreach ($request->images as $request_image) {
            Image::create([
                'url' => $request_image->store('public/images'),
                'project_id' => $id,
            ]);
        }
        return 'image uploaded';
    }


    public function createBG($bg_images)
    {
        if (Auth::user()->type !== 0) {
            return response()->json(Error::access_denied(), 403);
        }
        $image_path = $bg_images->image->store('public/bg');
        if (isset($bg_images->preview)) {
            $preview_path = $bg_images->preview->store('public/bg/preview');
        } else {
            $preview_path = $image_path;
        }
        $bg = new Background();
        $bg->name = $bg_images->name;
        $bg->img_url = $image_path;
        $bg->preview_url = $preview_path;
        $bg->save();
        return response()->json('done', 201);
    }

    public function deleteBG($id)
    {
        $bg = Background::find($id);
        if ($bg) {
            if (Storage::exists($bg->img_url)) {
                Storage::delete($bg->img_url);
            }
            if (Storage::exists($bg->preview_url)) {
                Storage::delete($bg->preview_url);
            }
            $bg->delete();
            return response()->json('done', 201);
        } else {
            return Error::file_not_found();
        }
    }

    public function createFile($request, $type = 1)
    {
        if($type == 1){
            $client_id = Helper::getClientId();
        }else{
            $client_id = Auth::user()->client_id;
        }

        $project_id = $request->project_id;
        $user_type = $type;
        if ($request->has('file_name')) {
            $file_name = $request->file_name . '.' . $request->document->getClientOriginalExtension();
        } else {
            $file_name = $request->document->getClientOriginalName();
        }
        $file_path = $request->document->store('public/documents');
        $file = new Filelist();
        $file->file_name = $file_name;
        $file->file_path = $file_path;
        $file->client_id = $client_id;
        $file->project_id = $project_id;
        $file->owner_type = $user_type;
        if ($user_type == 1) {
            $file->owner_id = $client_id;
        } else {
            $file->owner_id = Auth::user()->id;
        }
        $file->folder_id = $request->folder_id;
        $file->save();
        return response()->json('ok', 200);
    }

    public function deleteFile($request, $id)
    {
        $file = Filelist::find($id);
        if ($file) {
            if ($file->owner_type == User::$CLIENT) {
                if ($file->client_id != Helper::getClientId()) {
                    return Error::access_denied();
                }
            } else {
                $user = Auth::user();
                if($user->type == User::$CLIENT || $user->type == User::$ADMIN){
                    if($file->client_id != Helper::getClientId()){
                        return Error::access_denied();
                    }
                }else{
                    if ($file->owner_id != Auth::id()) {
                        return Error::access_denied();
                    }
                }
            }

            if (Storage::exists($file->file_path)) {
                Storage::delete($file->file_path);
            }
            $file->delete();
            return response()->json('ok', 200);
        } else {
            return Error::file_not_found();
        }
    }

    public function uploadLogo($request)
    {
        return $request->logo->store('public/logo');
    }
}