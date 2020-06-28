<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Invite_list
 * @package App\Models
 * @mixin Builder
 * @mixin Model
 * @property $invite_link
 * @property $user_id
 * @property $invite_type
 * @property $
 */
class Invite_list extends Model
{
    protected $primaryKey = 'invite_link';
    protected $fillable = [
        'invite_link',
        'user_id',
        'invite_type',
    ];
}
