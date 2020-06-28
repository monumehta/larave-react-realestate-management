<?php

namespace App\Http\Middleware\Custom;

use App\Errors\Error;
use App\Helper\Helper;
use App\Models\Client;
use App\Models\Subscriber;
use App\Repository\ProjectRepo;
use App\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckStatus
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = User::auth();
        if ($user->type == User::$CLIENT || $user->type == User::$ADMIN) {
            $client = Client::find(Helper::getClientId());
            if ($client) {
                switch ($client->status) {
                    case Client::BLOCKED:
                        return Error::blocked();
                        break;
                    case Client::WAITING_FOR_CONFIRMATION:
                        return Error::pending_administrator_approval();
                        break;
                }
//                case Client::$WAITING_FOR_PACKAGE_1:
//                case Client::$WAITING_FOR_PACKAGE_2:
//                case Client::$WAITING_FOR_PACKAGE_3:
//                case Client::$WAITING_FOR_PACKAGE_4:
//                case Client::$WAITING_FOR_PACKAGE_5:
//                    return Error::pending_administrator_approval();
//                    break;
            }
        } else {
            //todo убрать текущий респонс, так как на дашборде он не нужен.
            $client = Client::find($user->client_id);
            if($client->status == Client::BLOCKED || $client->status == Client::WAITING_FOR_CONFIRMATION){
//                $projectRepo = new ProjectRepo();
//                $sub = Subscriber::where('user_id',$user->id)->first();
//                $project = $projectRepo->getProjectForSub($sub->project_id);
//                $data = [];
//                $data['project_name'] = $project->name;
//                $data['city'] = $project->city;
//                $data['address'] = $project->address;
//                $data['background'] = $project->background;
//                $data['client_id'] = $project->client_id;
//                $data['status'] = 'blocked';
                return Error::blocked();
            }
        }
        return $next($request);
    }
}
