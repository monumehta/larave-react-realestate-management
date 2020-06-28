<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\Timeline;
use App\User;
use App\Repository\TimelineRepository;
use Illuminate\Http\Request;
use Exception;

class TimelineController extends Controller
{

    public function index()
    {
        $timelineRepo = new TimelineRepository();
        $user = User::auth();
        if($user->type == 0)
            $timeline = $timelineRepo->getAllTimelines();
        else if($user->type==1)
            $timeline = $timelineRepo->getTimelines($user->client_id);
        else 
            $timeline =[];

        return response()->json($timeline);
    }

    public function timeineByClient($id) {
        $timelineRepo = new TimelineRepository();
        return response()->json($timelineRepo->getTimelines($id));
    }


    public function show(int $id)
    {
        $timelineRepo = new TimelineRepository();
        $timeline = $timelineRepo->getTimelineById($id);

        if ($timeline->client_id != Helper::getClientId()) {
            return Error::access_denied();
        }

        unset($timeline->client_id);

        return response()->json($timeline);

    }


    public function newTimeline(Request $request)
    {
        $user = User::auth();
        if($user->type==1){
            $client_id = $user->client_id;
            Timeline::create([
                'client_id' => $client_id,
                'name' => $request->name,
                'timeline' => [],
            ]);
        }
        if($user->type==0){
            Timeline::create([
                'client_id' => $request->manager_id,
                'name' => $request->name,
                'timeline' => [],
            ]);
        }

        return response()->json(['message' => 'ok'], 200);
    }


    public function updateSteps(Request $request, $id)
    {
        $template = Timeline::find($id);
        $template->update([
            'name' => $template->name,
            'timeline' => $request->steps,
        ]);

        return response()->json(['message' => 'ok'], 200);
    }


    public function update(Request $request, $id)
    {
        $template = Timeline::find($id);

        $array1 = $template->timeline;
        $array2 = ['step_name'=>$request->step];

        array_push($array1, $array2);

        $template->timeline = $array1;

        $template->update([
            'name' => $template->name,
            'timeline' => $template->timeline,
        ]);

        return response()->json(['message' => 'ok'], 200);
    }


    public function delete(int $id)
    {
        $timeline = Timeline::find($id);
        if ($timeline->client_id != Helper::getClientId()) {
            return Error::access_denied();
        }

        try {
            $timeline->delete();
        } catch (Exception $exception) {
            return Error::mysqlException($exception->getMessage());
        }

        return response()->json(['message' => 'ok']);
    }

}



