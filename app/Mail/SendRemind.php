<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Sichikawa\LaravelSendgridDriver\SendGrid;

class SendRemind extends Mailable
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
            ->view('mail.remindSubscriber')
            ->subject('Reminder for the "' . $this->data['project_name'] . '" project')
            ->from('office@goclear.co.il')
            ->to($this->data['to']);
    }
}
