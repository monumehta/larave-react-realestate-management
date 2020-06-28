<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class News
 * @package App\Models
 * @mixin Builder
 * @property integer $id
 * @property integer $project_id
 * @property string $title
 * @property string $body
 * @property $publish_time
 */
class News extends Model {
    protected $table = 'news';

    protected $fillable = [
        'project_id',
        'title',
        'body',
        'publish_time',
    ];
}
