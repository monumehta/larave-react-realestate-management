<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Builder;

/**
 * Class Subscriber
 * @package App\Models
 * @mixin Builder
 * @property $client_id
 * @property $user_id
 * @property $project_id
 * @property $status
 * @property $is_signed
 * @property $id
 * @method static Subscriber find(int $id)
 * @method static Builder where($column, $operator = null, $value = null, $boolean = 'and')
 */
class Subscriber extends Model
{

    protected $fillable = [
        'user_id',
        'client_id',
        'project_id',
        'status',
        'is_signed',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function group(){
        return $this->hasMany(SubscribersGroupList::class);
    }

    public function project(){
        return $this->belongsTo(Project::class);
    }
}
