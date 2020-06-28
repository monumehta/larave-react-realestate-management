<?php


namespace App\Repository;

use App\Models\News as Model;
use App\Models\News;
use Carbon\Carbon;
use Illuminate\Support\Collection;


class NewsRepository extends RepoBase
{
    public function __construct()
    {
        parent::__construct();
    }


    function getModelClass()
    {
        return Model::class;
    }

    public function getLastNews($project_id)
    {
        $columns = [
            'id',
            'project_id',
            'title',
            'body',
            'publish_time'
        ];
        $lastNews = $this->startCondition()
            ->where('project_id', $project_id)
            ->select($columns)
            ->orderBy('publish_time', 'DESC')
            ->first();
        if (!$lastNews){
            $lastNews = new News();
//            $lastNews->body = 'dont have news yet';
            $lastNews->body = 'אין עדכונים חדשים';
            $lastNews->publish_time = Carbon::today()->toDateString();
        }
        return $lastNews;
    }

    public function getLastNewsShort($project_id)
    {
        $columns = [
            'id',
            'title',
            'publish_time'
        ];
        $lastNews = $this->startCondition()
            ->where('project_id', $project_id)
            ->select($columns)
            ->orderBy('publish_time', 'DESC')
            ->first();
        return $lastNews;
    }

    

    public function getAllNewsByClient($client_id):Collection
    {
        $columns = [
            'id',
            'project_id',
            'title',
            'body',
            'publish_time'
        ];
        $allNews = $this->startCondition()
            ->where('client_id', $client_id)
            ->select($columns)
            ->orderBy('publish_time', 'DESC')
            ->get();
        return $allNews;
    }

    public function getAllNews($project_id):Collection
    {
        $columns = [
            'id',
            'project_id',
            'title',
            'body',
            'publish_time'
        ];
        $allNews = $this->startCondition()
            ->where('project_id', $project_id)
            ->select($columns)
            ->orderBy('publish_time', 'DESC')
            ->get();
        return $allNews;
    }

    public function getNewById($news_id):News
    {
        $columns = [
            'id',
            'project_id',
            'title',
            'body',
            'publish_time'
        ];
        $singleNews = $this->startCondition()
            ->select($columns)
            ->find($news_id);
        return $singleNews;
    }
}