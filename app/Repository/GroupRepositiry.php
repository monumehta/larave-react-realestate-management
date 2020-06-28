<?php


namespace App\Repository;


use App\Models\Subscribers_Group as Model;
use App\Models\Subscribers_Group;

class GroupRepositiry extends RepoBase
{
    public function __construct()
    {
        parent::__construct();
    }


    function getModelClass()
    {
        return Model::class;
    }
    
    public function getAllGroups()
    {
        $group = $this->startCondition()
            ->get();
        return $group;
    }


    public function getGroups($client_id)
    {
        $group = $this->startCondition()
            ->where('client_id', $client_id)
            ->get();
        return $group;
    }

    public function getGroup($id):Subscribers_Group
    {
        $column = [
            'id',
            'name',
            'client_id',
            'color'
        ];
        $group = $this->startCondition()
            ->select($column)
            ->find($id);
        return $group;
    }

    public function getGroupsWithSubs($client_id)
    {
        $column = [
            'id',
            'name',
//            'client_id',
            'color'
        ];
        $groups = $this->startCondition()
            ->where('client_id', $client_id)
            ->with('subscribers:subscriber_id,group_id')
            ->select($column)
            ->get();
        return $groups;
    }
}