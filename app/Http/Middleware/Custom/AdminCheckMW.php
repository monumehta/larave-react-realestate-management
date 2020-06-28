<?php

namespace App\Http\Middleware\Custom;

use App\Errors\Error;
use Closure;
use Illuminate\Support\Facades\Auth;

class AdminCheckMW
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
        if(Auth::user()->type ==0 || Auth::user()->type == 1 || Auth::user()->type == 3) {
            return $next($request);
        } else {
            return Error::access_denied();
        }
    }
}
