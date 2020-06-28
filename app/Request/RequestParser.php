<?php


namespace App\Request;


use App\Handler\BaseHandler;
use App\Handler\GetHandler;
use App\Handler\PostHandler;
use App\Handler\UnsupportedHandler;
use Illuminate\Http\Request;

class RequestParser {
    public function parse(Request $request) {
        /**
         * @var BaseHandler
         */
        if($request->request_type == 'GET'){
            $builder = new GetHandler();
        }else if($request->request_type == 'POST'){
            $builder = new PostHandler();
        }else{
            $builder = new UnsupportedHandler();
        }

        $builder->setRequest($request);

        return $builder->getAnswer();
    }
}