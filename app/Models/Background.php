<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Background
 * @package App\Models
 * @property  string $name
 * @method static Background find($id, $columns = ['*'])
 */
class Background extends Model
{
    public static $default = 1;

    protected $fillable = [
      'name',
    ];
}
