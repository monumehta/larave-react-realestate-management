<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Package
 * @package App\Models
 * @mixin Builder
 * @property integer $id
 * @property string $type
 * @property string $name
 * @property string $cost
 * @property string $max_subscribers
 * @property string $max_projects
 * @property boolean $can_send_email
 * @property boolean $can_send_sms
 * @property boolean $can_send_watsup
 */
class Package extends Model
{
    protected $fillable = [
        'name',
        'max_subscribers',
        'cost',
        'max_projects',
    ];

}
