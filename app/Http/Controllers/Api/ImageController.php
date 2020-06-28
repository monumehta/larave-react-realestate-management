<?php

namespace App\Http\Controllers\Api;

use App\FileWorker\Fileworker;
use App\Http\Controllers\Controller;

class ImageController extends Controller
{
//    public function index($project_id)
//    {
//
////        $imgRepo = new ImageRepository();
////        return $imgRepo->getProjectImage($project_id);
//    }
//
//    public function store(Request $request)
//    {
//        $validator = Validator::make($request->all(), [
//            'image' => 'required|image|max:5120|',
//            'project_id' => 'required|integer',
//        ]);
//        if ($validator->fails()) {
//            return response()->json($validator->errors(),422);
//        }
//        $fw = new Fileworker();
//        return $fw->createImage($request);
//    }
//
//    public function show($id)
//    {
//        $imgRepo = new ImageRepository();
//        return $imgRepo->getImageURL($id);
//    }

    public function delete($id)
    {
        $fileWorker = new Fileworker();
        return $fileWorker->deleteImage($id);
    }
}
