<?php


namespace App\Handler;


use App\Models\Client;
use App\Models\Package;
use App\Models\Project;
use App\Repository\ProjectRepo;
use App\Repository\SubscribersRepository;
use Illuminate\Support\Facades\Auth;

class GetHandler extends BaseHandler {
    public function getAnswer() {
        //такие вот странные роуты...
        if (!isset($this->request['request'])) {
            return ['message' => 'request dont have request field'];
        }
        switch ($this->request['request']) {
            case '/':
                return $this->index();
                break;
            case 'test':
                return $this->test();
        }
        return $this->request;
    }

    private function index() {
        $projectRepo = new ProjectRepo();
        $subsRepo = new SubscribersRepository();
        $user = Auth::user();
        $client = Client::all()->find($user->client_id);
        $package = Package::all()->find($client->company_package);
        $projects = $projectRepo->getAllProjectShort($user->client_id, ['id','project_name']);

        $user_info = [
            'access_level' => $user->type,
            'user_name' => $user->name,
            'client_id' => $user->client_id,
            'current_subscribers' => $subsRepo->countSubsForClient($user->client_id),
//            'total_subscribers' =>$package->max_subscribers,
            'total_subscribers' =>1000,
//            'package_name' => $package->name,
            'package_name' => 'test package',
            'current_projects' => count($projects),
//            'total_projects' => $package->max_projects
            'total_projects' => 100500,
        ];
        $data = [
            'projects'=> $projects,
        ];
        $response = [
            'user_info' => $user_info,
            'data' => $data
        ];
        return $response;
    }

    private function test(){
        return 'u r here on';
    }

}