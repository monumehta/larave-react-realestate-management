<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Auth;
use App\Models\Client;
use App\Models\Customer;

use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    // protected $redirectTo = RouteServiceProvider::HOME;
     protected $redirectTo = '/managers';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    protected function credentials(Request $request)
    {
        if(is_numeric($request->get('email'))){
            return ['phone'=>$request->get('email'),'password'=>$request->get('password')];
        }
        return $request->only($this->username(), 'password');
    }

    public function authenticated()
    {   
        
        $user = Auth::user();
       
        if($user->type === 0) {
            return redirect('/managers');    

        } else if($user->type === 1) {
            if($user->client_id !== NULL && $user->client_id !== '') {

                $manager = Client::where('id',$user->client_id)->first();

                if($manager->status) {
                    return redirect('/dashboard');
                } else {
                    return redirect('/error/page')->with(Auth::logout());
                }
                
            } else {
                return redirect('/error/page')->with(Auth::logout());
            }

        } else if($user->type === 3) {
            $manager = Client::where('id',$user->client_id)->first();
            
            if($manager->status) {
                if($user->project_id !== NULL && $user->project_id !== '') {
                    return redirect('/projects/vuec/'.base64_encode($user->project_id));

                } else {
                    return redirect('/error/page')->with(Auth::logout());
                }
            } else {
                return redirect('/error/page')->with(Auth::logout());
            }
            
        }
        
    }
}
