<?php

namespace App\Http\Controllers\Api;

use App\AccessController\AccessController;
use App\Errors\Error;
use App\Http\Controllers\Controller;
use App\Models\News;
use App\Repository\NewsRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class NewsController extends Controller
{
    public function index(int $project_id)
    {
        if (AccessController::dontHaveProject($project_id)) {
            return Error::access_denied();
        }

        $newsRepo = new NewsRepository();
        $news = $newsRepo->getAllNews($project_id);
        return response()->json($news);
    }

    public function show(int $id)
    {
        $newsRepo = new NewsRepository();
        $news = $newsRepo->getNewById($id);

        if (AccessController::dontHaveProject($news->project_id)) {
            return Error::access_denied();
        }

        return response()->json($news);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|integer|exists:projects,id',
            'title' => 'required|string|min:5|max:200',
            'body' => 'required|string|min:5|max:21845',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(),422);
        }

        if (AccessController::dontHaveProject($validator->validated()['project_id'])) {
            return Error::cant_do_this();
        }

        $valid = $validator->validated();
        $valid['publish_time'] = Carbon::now();

        $news = News::create([$valid]);

        return response()->json(['news_id' => $news->id]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'string|min:5|max:200',
            'body' => 'string|min:5|max:21845',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(),422);
        }

        $news = News::find($id);

        if (AccessController::dontHaveProject($news->project_id)) {
            return Error::access_denied();
        }

        $news->update($validator->validated());

        return response()->json(['message' => 'update']);
    }

    public function delete(int $id)
    {
        $news = News::find($id);

        if (AccessController::dontHaveProject($news->project_id)) {
            return Error::access_denied();
        }

        try{
            $news->delete();
        }catch (Exception $exception){
            return Error::mysqlException($exception->getMessage());
        }

        return response()->json(['message' => 'deleted']);
    }
}
