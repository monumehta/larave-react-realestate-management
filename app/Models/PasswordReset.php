<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PasswordReset
 * @package App\Models
 * @mixin Builder
 * @property $email
 * @property $token
 */
class PasswordReset extends Model
{
    protected $fillable = [
        'email', 'token'
    ];
}
