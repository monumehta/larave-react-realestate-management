<?php

namespace App\Jobs;

use App\Mail\SendRemind;
use App\Models\Remind;
use App\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendReminderEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $reminds = Remind::where('send_date', Carbon::today()->toDateString())->with('user:id,email')->get();
        foreach ($reminds as $remind) {
            Mail::to($remind->user)->send(new SendRemind($remind->message));
            $remind->delete();
        }
    }
}
