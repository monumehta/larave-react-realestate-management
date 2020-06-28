<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\ResetsPasswords;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Auth;
use App\User;

use Illuminate\Support\Facades\Password;

class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    use ResetsPasswords;

    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    protected $redirectTo = '/password/success';


    public function showResetForm(Request $request, $token = null)
    {
        $user = User::where('email',$request->email)->first();
        if($user) {
            return view('auth.passwords.reset')->with(
                ['token' => $token, 'email' => $request->email, 'name'=>$user->name]
            );
        } else {
            return view('auth.passwords.reset')->with(
                ['token' => $token, 'email' => $request->email, 'name'=>'']
            );
        }
        
    }

    /**
     * Reset the given user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function reset(Request $request)
    {
        
        $request->validate($this->rules(), $this->validationErrorMessages());

        $user = User::where('email',$request->email)->first();

        if($user) {
            $user->password = Hash::make($request->password);
    
            $user->setRememberToken(Str::random(60));
        
            $user->save();
        
            event(new PasswordReset($user));
    
            return redirect('/password/success')->with(Auth::logout());
        }

        return redirect('/password/reset')->with(Auth::logout());

       

    }

    protected function resetPassword($user, $password)
    {
        $user->password = Hash::make($password);
    
        $user->setRememberToken(Str::random(60));
    
        $user->save();
    
        event(new PasswordReset($user));

        return redirect('/password/success')->with(Auth::logout());;
 
    
    }

    
}
