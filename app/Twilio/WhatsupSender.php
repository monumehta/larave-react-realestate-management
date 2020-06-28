<?php


namespace App\Twilio;

use App\User;
use Twilio\Rest\Client;

class WhatsupSender
{
    protected $sid;
    protected $token;
    protected $twilio;

    protected $to;
    protected $body;

    protected $code = '+375';

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
            ->create("whatsapp:" . $this->to,
                [
                    "body" => $this->body,
                    "from" => "whatsapp:" . env("TWILIO_WHATSAPP_NUMBER")
                ]
            );
    }

    public function to(User $user)
    {
//        $this->to = '+972'.$user->phone;
        $this->to = /*$this->code . */$user->phone;
        return $this;
    }
}