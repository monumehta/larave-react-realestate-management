<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Timeline
 * @package App\Models
 * @mixin Builder
 * @property $client_id
 * @property $name
 * @property $timeline
 * @property $
 * @property $
 */
class Timeline extends Model
{
    protected $fillable = [
        'client_id',
        'name',
        'timeline',
        '',
        '',
    ];
    protected $casts = ['timeline' => 'array'];
}
