<?php


namespace App\Repository;


use App\Helper\Helper;
use App\User as Model;
use App\User;

class UserRepositiry extends RepoBase
{
    public function __construct()
    {
        parent::__construct();
    }

    function getModelClass()
    {
        return Model::class;
    }

    public function getUser($id)
    {
        $user = $this->startCondition()
            ->find($id);
        return $user;
    }

    public function getSendInfo($id)
    {
        $user = $this->startCondition()
            ->select(['id', 'name', 'email', 'phone'])
            ->find($id);
        return $user;
    }

    public function getAllSendUsers(array $ids)
    {
        $users = $this->startCondition()
            ->select(['id', 'name', 'email', 'phone'])
            ->whereIn('id', $ids);
        return $users;
    }

    public function getSubsNames(array $subs_id)
    {

        $subsRepo = new SubscribersRepository();
        $subsId = $subsRepo->getIdForProject2($subs_id);
        $clear_id = $subsId->pluck('user_id');
        $alias_id = [];
        foreach ($subsId as $sub) {
            $alias_id[$sub->user_id] = $sub->id;
        }
        $users = $this->startCondition()
            ->select(['id', 'name', 'email'])
            ->whereIn('id', $clear_id)
            ->get();
        foreach ($users as &$user) {
            $user->id = $alias_id[$user->id];
        }
        return $users;
    }

    public function getClientUser(): ?User
    {
        $user = $this->startCondition()
            ->where('type', User::$CLIENT)
            ->where('client_id', Helper::getClientId())
            ->first();
        return $user;
    }

    public function getClientUserById($id): ?User
    {
        $user = $this->startCondition()
            ->where('client_id', $id)
            ->where('type', User::$CLIENT)
            ->first();

        return $user;
    }

}