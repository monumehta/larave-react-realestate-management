<?php


namespace App\Repository;


use App\Helper\Helper;
use App\Models\Client as Model;
use App\Models\Client;

class ClientRepository extends RepoBase
{
    public function __construct()
    {
        parent::__construct();
    }


    function getModelClass()
    {
        return Model::class;
    }

    public function getClients()
    {
        $clients = $this->startCondition()
            ->with('user')
            ->with('package')
            ->orderBy('updated_at', 'desc')
            ->get();
        return $clients;
    }

    public function getClient($id)
    {
        $clients = $this->startCondition()
            ->where('id',$id)
            ->with('user')
            ->with('package')
            ->orderBy('updated_at', 'desc')
            ->get();
        return $clients;
    }

    public function getSearchClients($searchTerm)
    {
        $clients = $this->startCondition()
            ->where('company_name', 'LIKE', "%{$searchTerm}%") 
            ->orWhere('full_name', 'LIKE', "%{$searchTerm}%") 
            ->orWhere('company_email', 'LIKE', "%{$searchTerm}%") 
            ->orWhere('company_phone1', 'LIKE', "%{$searchTerm}%") 
            ->with('user')
            ->with('package')
            ->orderBy('updated_at', 'desc')
            ->get();
        return $clients;
    }

    public function getClientById($id)
    {
        $client = $this->startCondition()
//            ->find($id)
            ->with('user:id,name,client_id')
            ->with('package:id,name')
            ->withCount('subscribers')
            ->find($id);
        return $client;

    }

    public function getClientInfo(): Client
    {
        $client = $this->startCondition()
            ->where('id', Helper::getClientId())
            ->with('package:id,name')
            ->first();
        return $client;
    }
}