<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Sichikawa\LaravelSendgridDriver\SendGrid;

class ChangePackage extends Mailable
{
    use Queueable, SerializesModels, SendGrid;
    public $data;
    public $subject;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
        if($data['new']){
            $this->subject = 'רישום לקוח חדש '.$data['company_name'];
        }else{
            $this->subject ='חבילה חדשה עבור לקוח "'.$this->data['company_name'].'" ';
        }
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->view('mail.admin.client_change_package')
            ->subject($this->subject)
            ->from('office@goclear.co.il');
    }
}
