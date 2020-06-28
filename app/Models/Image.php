<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Image
 * @package App\Models
 * @property $url
 * @method static Image find($id, $columns = ['*'])
 */
class Image extends Model
{
    protected $fillable = ['url','project_id'];
}
