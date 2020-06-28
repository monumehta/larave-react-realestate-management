<?php

namespace App\Http\Controllers\Api\Auth;

use App\Errors\Error;
use App\Http\Controllers\Controller;

use App\Http\Requests\SignUpRequest;
use App\Mail\RegistrationMailer;
use App\Models\Client;
use App\Models\Package;
use App\Models\Subscriber;
use App\Models\Customer;
use App\Repository\ProjectRepo;
use App\Repository\SubscribersRepository;
use Illuminate\Http\Request;
use App\User;
use Session;
use Redirect;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    /**
     * Create user
     *
     * @param  [string] name
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @return [string] message
     */
    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:200|min:3',
            'phone' => 'required|string|max:40|min:6',
            'email' => 'required|string|email|unique:users,email',
            'name' => 'required|string|max:40|min:3',
            'password' => 'required|string|confirmed',
        ]);
//        return response()->json($request->all());
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $client = new Client([
            'company_name' => $request->company_name,
            'company_phone1' => $request->phone,
            'company_email' => $request->email,
        ]);
        $client->company_package = 0;
        $client->save();

        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);
        $user->client_id = $client->id;
        $user->type = User::$CLIENT;
        $user->save();
        $data = [
            'user_name' => $user->name,
            'user_email' => $request->email,
            'company_name' => $client->company_name,
        ];
        Mail::to($user)->send(new RegistrationMailer($data));
        $token = $user->createToken('Laravel Password Grant Client')->accessToken;
        $response = ['token' => $token];
        return response($response, 200);
    }

    /**
     * Login user and create token
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [boolean] remember_me
     * @return [string] access_token
     * @return [string] token_type
     * @return [string] expires_at
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|numeric|digits:10',
            'password' => 'required|string',
            'remember_me' => 'boolean',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $countryCode = '972';
        $trimmedPhone = $countryCode . substr($request->phone, 1);

        $user = User::where('phone', $trimmedPhone)->first();
        if ($user) {

            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken('Laravel Password Grant Client')->accessToken;
                $response = ['token' => $token];
                return response($response, 200);
            } else {
                $response = "Password missmatch";
                return response($response, 422);
            }

        } else {
            $response = 'User does not exist';
            return response($response, 422);
        }
    }

    public function login_get()
    {
        $response = 'redirect';
        return response($response, 422);
    }

    /**
     * Logout user (Revoke the token)
     *
     * @return [string] message
     */
    public function logout(Request $request)
    {
        Session::flush();
        Auth::logout();
        $response = 'redirect';
        return response($response, 200);
    }

    /**
     * Get the authenticated User
     *
     * @return [json] user object
     */
    public function user(Request $request)
    {
        $projectRepo = new ProjectRepo();
        $subsRepo = new SubscribersRepository();
        $user = Auth::user();
        if($user->id != 1) {
            $client = Client::find($user->client_id);
            $projects = $projectRepo->getAllProjectShort($user->client_id, ['id', 'project_name']);
            if ($client->company_package != 0) {
                $package = Package::find($client->company_package);
                $total_projects = $package->max_projects;
                $max_subs = $package->max_subscribers;
                $package_name = $package->name;
            } else {
                $package = 'package not yet selected';
                $total_projects = '0';
                $max_subs = 'package not yet selected';
                $package_name = 'package not yet selected';
            }
            $user_info = [
                'id' => $user->id,
                'access_level' => $user->type,
                'package_status' =>$client->package_status,
                'name' => $user->name,
                'type' => $user->type,
                'client_id' => $user->client_id,
                'customer_id' => $user->customer_id,
                'status' => $client->status,
                'current_subscribers' => $subsRepo->countSubsForClient($user->client_id),
                'total_subscribers' => $max_subs,
                'package_name' => $package_name,
                'current_projects' => count($projects),
                'total_projects' => $total_projects,
            ];
            if($user->type==1) {
                $data = [
                    'projects' => $projects,
                ];
            } else {
                $data = [
                    'projects' => [],
                    'customer' => Customer::find($user->customer_id)
                ];
            }
            
            $response = [
                'user_info' => $user_info,
                'data' => $data,
            ];
            if($user->type == User::$SUBSCRIBER){
                $sub_count = $subsRepo->getProjectsIDForUser($user->id);
                if($sub_count->count() == 1){
                    $response['singleProject'] = $sub_count->first()->id;
                }else{
                    $response['singleProject'] = null;
                }
            }
        }else{
            $user_info = $user;
            $response = [
                'user_info' => $user_info,
                'data' => []
            ];
        }
//        dd($client->company_package);
        return $response;
    }

    public function noauth()
    {
        return Error::access_denied();
    }
}
