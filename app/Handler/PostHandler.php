<?php


namespace App\Handler;


class PostHandler extends BaseHandler {
    public function getAnswer() {
        return $this->request;
    }
}