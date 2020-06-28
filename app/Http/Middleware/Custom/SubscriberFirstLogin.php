<?php

namespace App\Http\Middleware\Custom;

use App\User;
use Closure;
use Illuminate\Support\Facades\Auth;

class SubscriberFirstLogin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = Auth::user();
        if($user->type == 2 && $user->is_signed == 0){
            $user->is_signed = 1;
            $user->save();
        }
        return $next($request);
    }
}
