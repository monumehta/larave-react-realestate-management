<?php


namespace App\Twilio;


use App\User;
use Twilio\Rest\Client;

class SMSSender
{
    protected $sid;
    protected $token;
    protected $twilio;

    protected $to;
    protected $body;

    protected $code = '+972';

    public function __construct(string $body)
    {
        $this->sid = env('TWILIO_ACCOUNT_SID');
        $this->token = env("TWILIO_AUTH_TOKEN");
        $this->twilio = new Client($this->sid, $this->token);

        $this->body = $body;
    }

    public function send()
    {
        $message = $this->twilio->messages
            ->create($this->to,
                [
                    "body" => $this->body,
                    "from" => env("TWILIO_PHONE_NUMBER")
                ]
            );
        return $message;
    }

    public function to(User $user)
    {
        if (strpos($user->phone, '+') !== 0) {
            $phone = '+' . $user->phone;
        } else {
            $phone = $user->phone;
        }
        $this->to = $phone;
        return $this;
    }
}