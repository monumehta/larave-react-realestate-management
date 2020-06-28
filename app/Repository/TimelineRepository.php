<?php


namespace App\Repository;


use App\Models\Timeline as Model;

class TimelineRepository extends RepoBase {
    public function __construct() {
        parent::__construct();
    }
    function getModelClass() {
        return Model::class;
    }

    public function getAllTimelines(){
        $timelines = $this->startCondition()
            ->get();
        return $timelines;
    }

    public function getTimelines($client_id){
        $timelines = $this->startCondition()
            ->where('client_id',$client_id)
            ->get();
        return $timelines;
    }
    public function getTimelineById($timeline_id){
        $column = [
            'id',
            'name',
            'timeline',
            'client_id'
        ];
        $timelines = $this->startCondition()
            ->select($column)
            ->find($timeline_id);
        return $timelines;
    }
}