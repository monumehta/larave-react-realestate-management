<?php


namespace App\Twilio;


use Twilio\Rest\Client;

class Number
{
    protected static $sid;
    protected static $token;
    protected static $twilio = null;
//    protected static $fetchNumbers = [];

    public static function isInvalid($numbers)
    {
        self::$sid = env('TWILIO_ACCOUNT_SID');
        self::$token = env("TWILIO_AUTH_TOKEN");
        self::$twilio = new Client(self::$sid, self::$token);
//        if(strpos($numbers,'+') !== 0){
//            $numbers = '+'.$numbers;
//        }
        $answer = [];
        try {
            self::$twilio->lookups->v1->phoneNumbers($numbers)->fetch();
            return false;
        } catch (\Exception $e) {
//            return $e->getMessage();
            return true;
        }
//        if (is_array($numbers)) {
//            foreach ($numbers as $key => $number) {
//            }
//            return response()->json($answer);
//        }
    }

}