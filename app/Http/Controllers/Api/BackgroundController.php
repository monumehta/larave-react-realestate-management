<?php

namespace App\Http\Controllers\Api;

use App\FileWorker\Fileworker;
use App\Http\Controllers\Controller;
use App\Models\Background;
use App\Repository\BackgroundRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BackgroundController extends Controller
{

    public function index()
    {
        $bg = new BackgroundRepository();
        return $bg->getAllBG();
    }

    public function show(int $id)
    {
        $bg = new BackgroundRepository();
        return $bg->getBGInfo($id);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|max:1024',
            'preview' => 'image|max:1024',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $fw = new Fileworker();
        return $fw->createBG($validator->validated());
    }

    public function getBackground(int $id)
    {
        $bg = new BackgroundRepository();
        return $bg->getBG($id);
    }

    public function getPreview(int $id)
    {
        $bg = new BackgroundRepository();
        return $bg->getPre($id);
    }

    public function update(Request $request, int $id)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:40',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $bg = Background::find($id);
        $bg->update($validator->validated());
        return response()->json('done', 201);
    }

    public function delete(int $id)
    {
        $fw = new Fileworker();
        return $fw->deleteBG($id);
    }

}
