<?php

namespace App\Http\Controllers\Api;

use App\AccessController\AccessController;
use App\Errors\Error;
use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Models\SubscribersGroupList;
use App\Repository\SubscribersRepository;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubscribersController extends Controller
{

    public function clientIndex()
    {
        $subsRepo = new SubscribersRepository();
        $subs = $subsRepo->clientSubscribers(Helper::getClientId());

        return response()->json($subs);
    }

    public function projectIndex(int $project_id)
    {
        if (AccessController::dontHaveProject($project_id)) {
            return Error::access_denied();
        }
        $subsRepo = new SubscribersRepository();
        $subs = $subsRepo->projectSubscribers($project_id);

        return response()->json($subs);
    }


    public function regroup(Request $request)
    {
        $subscribers = $request->subscribers_list;
        $errors = [];

        foreach ($subscribers as $subscriber) {
            $sub = Subscriber::find($subscriber['subscriber_id']);

            if (!$sub) {
                return Error::subscriber_not_found();
            }

            if (AccessController::dontHaveProject($sub->project_id)) {
                return Error::access_denied();
            }

            //удаляем лишние группы
            SubscribersGroupList::where('subscriber_id', '=', $sub->id)
                ->whereNotIn('group_id', $subscriber['groups'])
                ->delete();

            $current_groups_list = SubscribersGroupList::where('subscriber_id', '=', $sub->id)
                ->get()
                ->pluck('group_id')
                ->toArray();

            foreach ($subscriber['groups'] as $group) {

                if (!in_array($group, $current_groups_list)) {
                    SubscribersGroupList::create([
                        'subscriber_id' => $sub->id,
                        'group_id' => $group
                    ]);
                }
            }

        }

        if ($errors) {
            return response()->json(['errors' => $errors], 200);
        }

        return response()->json('ok', 200);
    }


    public function show(int $subscriber_id)
    {
        $subsRepo = new SubscribersRepository();
        $subs = $subsRepo->getSubscriber($subscriber_id);

        if (Helper::getClientId() != $subs->client_id) {

            return Error::access_denied();
        }

        return response()->json($subs);
    }

    public function store()
    {
        return response()->json('заглушка для стора');
    }

    public function update(Request $request, $subscriber_id)
    {
        $sub = Subscriber::find($subscriber_id);

        if (!$sub) {
            return Error::user_not_found();
        }

        if (AccessController::dontHaveProject($sub->project_id)) {

            return Error::access_denied();
        }

        $user = User::find($sub->user_id);
        $saveUser = false;
        if (isset($request->status)) {
            $sub->status = $request->status;
            $sub->save();
        }

        if (isset($request->name)) {
            $user->name = $request->name;
            $saveUser = true;
        }

        if (isset($request->phone)) {
            $user->phone = $request->phone;
            $saveUser = true;
        }
        if ($saveUser) {
            $user->save();
        }

        return response()->json('ok', 200);
    }

    public function delete(int $subscriber_id)
    {
        $sub = Subscriber::find($subscriber_id);

        if (!$sub) {
            return Error::user_not_found();
        }

        // if (AccessController::dontHaveProject($sub->project_id)) {
        //     return Error::access_denied();
        // }

        $user = User::find($sub->user_id);
        $sublist = SubscribersGroupList::where('subscriber_id', $sub->id)->get();

        try {
            DB::beginTransaction();
            foreach ($sublist as $subl) {
                $subl->delete();
            }
            $sub->delete();
            $user->delete();
            DB::commit();
        } catch (Exception $exception) {
            DB::rollBack();
            return Error::mysqlException($exception->getMessage());
        }

        return response()->json('ok', 200);
    }
}
