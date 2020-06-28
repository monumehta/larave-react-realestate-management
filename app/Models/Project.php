<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;

/**
 * Class Project
 * @package App\Models
 * @property integer $id
 * @property integer $client_id
 * @property string $project_name
 * @property string $address
 * @property string $address2
 * @property string $city
 * @property string $background
 * @property $timeline
 * @property boolean $remind
 * @property string $remind_message
 * @property $remind_next_date
 * @property integer $remind_period
 * @property boolean $is_published
 * @property integer $current_step
 * @property string $step_name
 *
 * @method static Project find($id, $columns = ['*'])
 * @method static Builder where($column, $operator = null, $value = null, $boolean = 'and')
 *
 */
class Project extends Model
{
    // protected $casts = ['timeline' => 'array'];
    protected $fillable = [
        'project_name',
        'client_id',
        'project_link',
        'address',
        'address2',
        'city',
        'background',
        'remind',
        'remind_message',
        'remind_period',
        'is_published',
        'subdivision',
        'backgrounds',
        'logoes',
        'gallery',
        'timeline_id',
        'steps',
        'current_status',
        'url_link'
    ];

    public function news()
    {
        return $this->hasMany(News::class);
    }

    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    public function clients()
    {
        return $this->belongsTo(Client::class,'client_id');
    }
}
