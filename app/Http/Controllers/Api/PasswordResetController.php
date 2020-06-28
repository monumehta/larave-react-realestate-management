<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\Http\Controllers\Controller;
use App\Mail\PasswordResetRequest;
use App\Mail\PasswordResetSuccess;
use App\Models\PasswordReset;
use App\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::where('email', $validator->validated()['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'We can\'t find a user with that e-mail address.'], 404);
        }


        $passwordReset = PasswordReset::updateOrCreate(
            ['email' => $user->email],

            [
                'email' => $user->email,
                'token' => Str::random(60)
            ]
        );

        if ($user && $passwordReset) {
            $data = [
                'email' => $user->email,
                'token' => $passwordReset->token,
                'user_name' => $user->name,
            ];
            Mail::to($user)->send(new PasswordResetRequest($data));
        }

        return response()->json(['message' => 'We have e-mailed your password reset link!']);
    }

    public function find(Request $request)
    {
        $token = $request->token;
        $passwordReset = PasswordReset::where('token', $token)->first();

        if (!$passwordReset) {
            return response()->json(['message' => 'This password reset token is invalid.'], 404);
        }

        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {

            try {
                $passwordReset->delete();
            } catch (Exception $exception) {
                return Error::mysqlException($exception->getMessage());
            }

            return response()->json(['message' => 'This password reset token is invalid.'], 404);
        }

        return response()->json(['message' => 'ok']);
    }

    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|confirmed',
            'token' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $valid = $validator->validated();

        $passwordReset = PasswordReset::where([
            ['token', $valid['token']],
            ['email', $valid['email']]
        ])->first();

        if (!$passwordReset) {
            return response()->json(['message' => 'This password reset token is invalid.'], 404);
        }

        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {

            try {
                $passwordReset->delete();
            } catch (Exception $exception) {
                return Error::mysqlException($exception->getMessage());
            }

            return response()->json(['message' => 'This password reset token is invalid.'], 404);
        }

        $user = User::where('email', $passwordReset->email)->first();

        if (!$user) {
            return response()->json(['message' => 'We can\'t find a user with that e-mail address.'], 404);
        }

        try {
            $passwordReset->delete();
        } catch (Exception $exception) {
            return Error::mysqlException($exception->getMessage());
        }

        $user->password = bcrypt($valid['password']);
        $user->save();

        $data = [
            'user_name' => $user->name,
            'user_email' => $user->email,
        ];
        Mail::to($user)->send(new PasswordResetSuccess($data));

        return response()->json('ok', 200);
    }
}
