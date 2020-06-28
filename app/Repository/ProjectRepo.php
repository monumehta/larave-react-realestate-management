<?php


namespace App\Repository;


use App\Models\Project;
use App\Models\Customer;
use App\Models\Project as Model;

class ProjectRepo extends RepoBase
{
    public function __construct()
    {
        parent::__construct();
    }


    function getModelClass()
    {
        return Model::class;
    }

    public function getAllProjectShort($client_id)
    {
        $projects = $this->startCondition()
            ->where('client_id', $client_id)
//            ->with('news:id,title,project_id')
            ->orderBy('created_at', 'DESC')
            ->get()
            ->toBase();
        foreach ($projects as &$project) {
            $project['subscribers_count'] = Customer::where('project_id',$project->id)->get()->count();
            
        }
        return $projects;
    }

    public function getAllProjectShortSearch($client_id, $searchVal)
    {
        $subsRepo = new SubscribersRepository();
        $projects = $this->startCondition()
            ->where('client_id', $client_id)
            ->where(function ($query) use ($searchVal) {
                $query->where('project_name', 'LIKE', "%{$searchVal}%") 
                    ->orwhere('client_id', 'LIKE', "%{$searchVal}%") 
                    ->orwhere('id', 'LIKE', "%{$searchVal}%") 
                    ->orwhere('city', 'LIKE', "%{$searchVal}%") ;
            })
            ->orderBy('created_at', 'DESC')
            ->get()
            ->toBase();
        foreach ($projects as &$project) {
            $project['subscribers_count'] = $subsRepo->countSubsForProject($project->id);
        }
        return $projects;
    }

    public function getProjectForCustomer($project_id)
    {
        $subsRepo = new SubscribersRepository();
        $projects = $this->startCondition()
            ->where('id', $project_id)
//            ->with('news:id,title,project_id')
            ->orderBy('created_at', 'DESC')
            ->get()
            ->toBase();
        foreach ($projects as &$project) {
            $project['subscribers_count'] = $subsRepo->countSubsForProject($project->id);
        }
        return $projects;
    }

    public function getAllProjectShortForAdmin()
    {
        $subsRepo = new SubscribersRepository();
        $projects = $this->startCondition()
//            ->with('news:id,title,project_id')
            ->orderBy('id', 'DESC')
            ->get()
            ->toBase();
        foreach ($projects as &$project) {
            $project['subscribers_count'] = $subsRepo->countSubsForProject($project->id);
        }
        return $projects;
    }

    public function getAllProjectShortForAdminSearch($searchVal)
    {
        $subsRepo = new SubscribersRepository();
        $projects = $this->startCondition()
            ->where('project_name', 'LIKE', "%{$searchVal}%") 
            ->orwhere('client_id', 'LIKE', "%{$searchVal}%") 
            ->orwhere('id', 'LIKE', "%{$searchVal}%") 
            ->orwhere('city', 'LIKE', "%{$searchVal}%") 
            ->orderBy('id', 'DESC')
            ->get()
            ->toBase();
        foreach ($projects as &$project) {
            $project['subscribers_count'] = $subsRepo->countSubsForProject($project->id);
        }
        return $projects;
    }

    public function getProjectById($id)
    {

        $project = $this->startCondition()
            ->find($id);
        return $project;
    }

    public function getDuplicateData($id):Project
    {
        $project = $this->startCondition()
            // ->select('project_name', 'timeline', 'background')
            ->find($id);
        return $project;
    }

    public function getProjectForSub(int $project_id)
    {
        $project = $this->startCondition()
            ->find($project_id);
        $imgRepo = new ImageRepository();
        $bgRepo = new BackgroundRepository();
        $newsRepo = new NewsRepository();

        //delete unnecessary information
        if ($subs_timeline = $project->timeline) {
            foreach ($subs_timeline['steps'] as &$step) {
                unset($step['send_memo']);
                unset($step['step_memo']);
            }
        }
        //end

        //convert
        $folders = [];
        $folders[] = [
            'id' => 'subscriber_folder',
            'name' => 'Your folder',
        ];
        foreach ($project->folders as $fold) {
            $folders[] = [
                'id' => $fold->id,
                'name' => $fold->name,
            ];
        }

        $lastNews = $newsRepo->getLastNews($project_id);
        $news = [
            'message' => $lastNews->body,
            'date' => $lastNews->publish_time,
        ];
        $images = $imgRepo->getProjectImage($project_id);
        $image = [];
        foreach ($images as $img) {
            $image[] = [
                'url' => $img->url,
            ];
        }

        $data = [
            'project_id' => $project->id,
            'project_name' => $project->project_name,
            'city' => $project->city,
            'address' => $project->address,
            'address2' => $project->address2,
            'image' => $image,
            'background' => $bgRepo->getBG($project->background),
            'timeline' => $subs_timeline,
            'last_news' => $news,
            'folders' => $folders,
        ];
        return $data;
    }

    public function getProjectForClient(int $project_id)
    {
        $project = $this->startCondition()
            ->find($project_id);

        $imgRepo = new ImageRepository();
        $bgRepo = new BackgroundRepository();
        $newsRepo = new NewsRepository();
        $clientRepo = new ClientRepository();


        //convert
        $folders = [];
        foreach ($project->folders as $fold) {
            $folders[] = [
                'id' => $fold->id,
                'name' => $fold->name,
            ];
        }

        $subscriber_folders = [];
        $fileRepo = new FileRepository();
        $subsFolders = $fileRepo->getSubscriberFolders($project_id);
        foreach ($subsFolders as $folder) {
            $subscriber_folders[] = [
                'id' => $folder->id,
                'name' => $folder->name,
                'email' => $folder->email,
            ];
        }

        $lastNews = $newsRepo->getLastNews($project_id);
        $news = [
            'message' => $lastNews->body,
            'date' => $lastNews->publish_time,
        ];

        $allNews = $newsRepo->getAllNews($project_id);
        

        $images = $imgRepo->getProjectImage($project_id);
        $image = [];
        foreach ($images as $img) {
            $image[] = [
                'url' => $img->url,
            ];
        }

        $data = [
            'id' => $project->id,
            'project_name'=>  $project->project_name,
            'city'=>  $project->city,
            'remind'=>  $project->remind,
            'remind_period'=>  $project->remind_period,
            'remind_message'=>  $project->remind_message,
            'subdivision'=>  json_decode($project->subdivision), 
            'backgrounds'=>  json_decode($project->backgrounds), 
            'logoes'=>  json_decode($project->logoes), 
            'gallery'=>   json_decode($project->gallery), 
            'client_id'=>  $project->client_id,
            'project_id'=> $project->id,
            'timeline_id'=> $project->timeline_id,
            'steps'=> $project->steps,
            'current_status'=>  $project->current_status,
            'image' => $image,
            'background' => $bgRepo->getBG($project->background),
            'project' => $project,
            'last_news' => $news,
            'folders' => $folders,
            'subscriber_folders' => $subscriber_folders,
            'updated_at' => $project->updated_at,
            'updates' => json_decode($project->updates),
            'client' => $clientRepo->getClient($project->client_id),
            'url_link' => $project->url_link,
            'last_news' => $lastNews,
            'all_news' => $allNews,
        ];
        return $data;
    }
}