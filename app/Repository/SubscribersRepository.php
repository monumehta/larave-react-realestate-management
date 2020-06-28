<?php


namespace App\Repository;

use App\Models\Subscriber as Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class SubscribersRepository extends RepoBase
{
    public function __construct()
    {
        parent::__construct();
    }


    function getModelClass()
    {
        return Model::class;
    }

    public function countSubsForProject($project_id)
    {
        $count_sub = $this->startCondition()
            ->where('project_id', $project_id)
            ->select('id')
            ->get()
            ->count();
        return $count_sub;
    }

    public function countSubsForClient($client_id)
    {
        $count_sub = $this->startCondition()
            ->where('client_id', $client_id)
            ->select('id')
            ->get()
            ->count();
        return $count_sub;
    }

    public function clientSubscribers($client_id)
    {
        $columns = [
            'id',
            'project_id',
            'client_id',
            'status',
            'is_signed',
            'user_id'
        ];
        $subs = $this->startCondition()
            ->where('client_id', $client_id)
            ->select($columns)
            ->with('user:name,id,phone,email')
//            ->with('group:id,name')
            ->get();
        return $subs;
    }

    public function projectSubscribers($project_id)
    {
        $columns = [
            'id',
            'project_id',
            'client_id',
            'status',
            'is_signed',
            'user_id'
        ];
        $subs = $this->startCondition()
            ->where('project_id', $project_id)
            ->select($columns)
            ->with('user:name,id,phone,email')
            ->with('group:id,subscriber_id,group_id')
            ->get();
        $answer = [];
        foreach ($subs as $sub) {
            $g = [];
            if (!$sub->group->isEmpty()) {
                $g = $sub->group->pluck('group_id')->toArray();
            }
            $answer[] = [
                'id' => $sub->id,
                'status' => $sub->status,
                'is_signed' => $sub->is_signed,
                'user_id' => $sub->user->id,
                'user_name' => $sub->user->name,
                'user_email' => $sub->user->email,
                'user_phone' => $sub->user->phone,
                'group' => $g,
            ];
        }
        return $answer;
    }


    public function getSubscriber($id)
    {
        $columns = [
            'id',
            'project_id',
            'client_id',
            'status',
            'is_signed',
            'user_id'
        ];
        $subs = $this->startCondition()
            ->select($columns)
            ->with('user:name,id,phone,email')
            ->find($id);
//            ->get();
        return $subs;
    }

    public function getUsersForSend($ids)
    {
        
        $subs = $this->startCondition()
            ->with('user')
            ->whereIn('id', $ids)
            ->get();
        return $subs->pluck('user');
    }

    public function getProjectsIDForUser(int $user_id): Collection
    {
        $subs = $this->startCondition()
            ->where('user_id', $user_id)
            ->select('project_id')
            ->with('project:id,project_name')
            ->get();
//        return $subs;
        return $subs->pluck('project');
    }

    public function getIdForProject($id)
    {
        $subs = $this->startCondition()
            ->select(['user_id',])
            ->whereIn('id', $id)
            ->get();
        return $subs->pluck('user_id')->unique()->toArray();
    }

    public function getIdForProject2($id)
    {
        $subs = $this->startCondition()
            ->select(['user_id', 'id'])
            ->whereIn('user_id', $id)
            ->get();
        return $subs;
    }

    public function getSubForProject(int $id)
    {
        $subscriber = $this->startCondition()
            ->where('user_id', Auth::id())
            ->where('project_id', $id)
            ->first();
        return $subscriber;
    }

}