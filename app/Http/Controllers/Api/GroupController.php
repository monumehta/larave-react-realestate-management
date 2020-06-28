<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\Subscribers_Group;
use App\Repository\GroupRepositiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;
use App\User;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $groupRepo = new GroupRepositiry();

        // $user = User::auth();
        // if($user->type == 0)
        //     $groups = $groupRepo->getAllGroups();
        // else if($user->type==1)
        //     $groups = $groupRepo->getGroups($user->client_id);
        // else 
        //     $groups =[];

        
        $groups = $groupRepo->getGroups($request->manager_id);
        return response()->json($groups);
    }

    public function show(int $id)
    {
        $groupRepo = new GroupRepositiry();
        $group = $groupRepo->getGroup($id);

        if ($group->client_id != Helper::getClientId()) {
            return Error::access_denied();
        }

        return response()->json($group);
    }

    public function allGroupsForProject($id)
    {
        $groupRepo = new GroupRepositiry();
        $groups = $groupRepo->getGroupsWithSubs($id);

        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required',
            'name' => 'string|min:1|max:200',
            'color' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $valid = $validator->validated();
        // $valid['client_id'] = Helper::getClientId();
        $group = Subscribers_Group::create($valid);

        return response()->json(['group_id' => $group->id], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required',
            'name' => 'string|min:1|max:200',
            'color' => 'string|size:7',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $groupRepo = new GroupRepositiry();
        $group = $groupRepo->getGroup($id);

        if ($group->client_id != Helper::getClientId()) {
            return Error::access_denied();
        }

        $group->update($validator->validated());

        return response()->json(['message' => 'group updated'], 201);
    }

    public function delete(int $id)
    {
        $group = Subscribers_Group::find($id);

        if ($group->client_id != Helper::getClientId()) {
            return Error::access_denied();
        }

        try {
            $group->delete();
        } catch (Exception $exception) {
            return Error::mysqlException($exception->getMessage());
        }

        return response()->json(['message' => 'group delete'], 201);
    }

}
