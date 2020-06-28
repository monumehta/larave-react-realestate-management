<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class SubscribersGroupList
 * @package App\Models
 * @mixin Builder
 * @property $subscriber_id
 * @property $group_id
 */
class SubscribersGroupList extends Model
{
    protected $fillable = [
        'subscriber_id',
        'group_id',
    ];
    protected $table = 'subscriber_group_list';
}
