<?php


namespace App\Handler;


class UnsupportedHandler extends BaseHandler {
    public function getAnswer() {
        return 'this method is not supported now';
    }
}