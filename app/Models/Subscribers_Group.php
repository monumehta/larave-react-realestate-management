<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Subscribers_Group
 * @package App\Models
 * @mixin Builder
 * @mixin Model
 * @property $client_id
 * @property $name
 * @property $color
 * @property $id
 */
class Subscribers_Group extends Model
{
    protected $table = 'subscribers_groups';
    protected $fillable = [
        'name',
        'color',
        'client_id',

    ];

    public function subscribers(){
        return $this->hasMany(SubscribersGroupList::class,'group_id');
    }
}
