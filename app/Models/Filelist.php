<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Filelist
 * @mixin Model
 * @mixin Builder
 * @package App\Models
 * @property $client_id
 * @property $project_id
 * @property $file_name
 * @method static Filelist find($id, $columns = ['*'])
 */
class Filelist extends Model
{
    protected $table = 'filelist';

    protected $fillable = [
        'project_id',
        'folder_id',
        'client_id',
        'file_name',
        'file_path',
        'owner_id'
    ];

    public function owner()
    {
        return $this->belongsTo('App\User', 'owner_id', 'id');
    }
}
