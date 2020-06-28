<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Remind
 * @package App\Models
 * @mixin Builder
 * @property $user_id
 * @property $message
 * @property $send_date
 * @property $
 * @property $
 */
class Remind extends Model
{
    protected $fillable = [
      'user_id',
      'message',
      'send_date',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
