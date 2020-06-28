<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Sichikawa\LaravelSendgridDriver\SendGrid;

class MailForManager extends Mailable
{
    use Queueable, SerializesModels, SendGrid;
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
        return $this
            ->view('mail.mailForManager')
            ->subject($this->data['subject']. '; from: '.$this->data['from_email'])
            ->from('office@goclear.co.il')
            ->to($this->data['email']);
    }
}
