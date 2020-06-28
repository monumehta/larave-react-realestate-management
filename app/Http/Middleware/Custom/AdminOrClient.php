<?php

namespace App\Http\Middleware\Custom;

use App\Errors\Error;
use App\Helper\Helper;
use App\User;
use Closure;
use Illuminate\Http\Request;

class AdminOrClient
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if(!Helper::setId($request->client_id)){
            return Error::incomplete_data();
        };

        return $next($request);
    }
}
