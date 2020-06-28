<?php


namespace App\Handler;


class BaseHandler {
    protected $request;

    public function setRequest($request){
        $this->request = $request;
    }
    protected function addToResponse($key, $value){
        //TODO add fields to response
        $this->request[$key] = $value;
    }
}