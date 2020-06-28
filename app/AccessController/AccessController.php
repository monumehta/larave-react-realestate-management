<?php


namespace App\AccessController;


use App\Helper\Helper;
use App\Models\Package;
use App\Models\Project;
use App\Models\Subscriber;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccessController
{
    public static function haveProject(int $id)
    {
        if (Auth::user()->type == User::$SUBSCRIBER) {
            $sub = Subscriber::where('user_id', Auth::id())->first();
            if ($sub->project_id == $id) {
                return true;
            }
        }
        if (Auth::user()->type == 1 || Auth::user()->type == 0) {
            $projects_id = Project::where('client_id', Helper::getClientId())
                ->select('id')
                ->get();
            if (!$projects_id->isEmpty() && $projects_id->contains($id)) {
                return true;
            }
        }
        return false;
    }

    public static function dontHaveProject(int $id)
    {
        return !self::haveProject($id);
    }

    public function canCreateProject(Request $request)
    {
        $client = Client::find(Helper::getClientId());
        $package = Package::find($client->package);

    }
}