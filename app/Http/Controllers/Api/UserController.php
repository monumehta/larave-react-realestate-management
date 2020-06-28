<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\Http\Controllers\Controller;
use App\Http\Requests\ClientRequest;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function updateMail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
            'email' => 'required|string|email|unique:users,email',

        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $user = User::auth();

        if (Hash::check($validator->validated()['password'], $user->password)) {
            $user->email = $validator->validated()['email'];
            $user->save();
            return response()->json('done', 201);
        }

        return Error::cant_do_this();
    }

    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|confirmed',
            'old_password' => 'required|string',

        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $user = User::auth();
        if (Hash::check($validator->validated()['old_password'], $user->password)) {
            $user->password = bcrypt($validator->validated()['password']);
            $user->save();
            return response()->json('done', 201);
        }

        return Error::cant_do_this();
    }

    public function updateUserName(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:40|min:3',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::auth();
        $user->name = $validator->validated()['name'];
        $user->save();

        return response()->json('done', 201);
    }
}
