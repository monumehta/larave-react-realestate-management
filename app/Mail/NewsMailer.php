<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
// use Sichikawa\LaravelSendgridDriver\SendGrid;

class NewsMailer extends Mailable
{
    // use Queueable, SerializesModels, SendGrid;
    use Queueable, SerializesModels;
    public $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $message = $this
            ->view('mail.news')
            ->subject('הודעה חדשה מאתר GoClear')
            ->from('office@goclear.co.il');
        if (array_key_exists('attached', $this->data)) {
            foreach ($this->data['attached'] as $atach) {
                $message->attach($atach,[
                    'as' => $atach->getClientOriginalName(),
                ]);
            }
        }
        if (array_key_exists('user_atach', $this->data)) {
            $message->attachFromStorage($this->data['user_atach']['path'], $this->data['user_atach']['name']);
        }
        return $message;
    }
}
