<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Folder
 * @mixin Builder
 * @package App\Models
 * @property $id
 * @property $name
 * @property $project_id
 * @method static Folder create($fields);
 * @method static Folder find($fields);
 */
class Folder extends Model
{
    protected $fillable = [
        'project_id',
        'name',
        'folder_name',
        'owner_id',
        'type'
    ];

    public function fileList()
    {
        return $this->hasMany('App\Models\Filelist', 'folder_id', 'id');
    }
}
