<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Client
 * @package App\Models
 * @mixin Builder
 * @mixin Model
 * @property integer $id
 * @property string $company_name
 * @property string $company_logo
 * @property string $company_email
 * @property string $company_phone1
 * @property string $company_phone2
 * @property string $company_phone3
 * @property string $company_phone4
 * @property string $company_package
 * @property boolean $status
 * @property boolean $package_status
 * @property Package $package
 * @method static Client find($id, $columns = ['*'])
 * @method static Client create($fields)
 */

class Customer extends Model {

    //статичные константы для статусов
    public const WAITING_FOR_CONFIRMATION = 0; //ожидает подтверждения от администратора после регистрации
    public const CONFIRMED = 1; //
    public const BLOCKED = 2;
    public const PACKAGE_APPROVED = 0;
    public const WAITING_FOR_PACKAGE_1 = 1;
    public const WAITING_FOR_PACKAGE_2 = 2;
    public const WAITING_FOR_PACKAGE_3 = 3;
    public const WAITING_FOR_PACKAGE_4 = 4;
    public const WAITING_FOR_PACKAGE_5 = 5;

    protected $fillable = [
        'client_id',
        'project_id',
        'group_id',
        'total_free',
        'full_name',
        'mobile',
        'email',
        'updated',
        'country_apartment',
        'mailing_address',
        'street',
        'building_number',
        'entress',
        'block',
        'smooth',
        'sub_divistion',
        'percentage_of_ownership',
        'apartment',
        'floor',
        'current_apartment_area',
        'current_apartment_type',
        'additional_space',
        'balcony_area',
        'storage_space',
        'parking',
        'warning',
        'status',
        'date_of_signature',
        'remarks',
        'documentation',
        'inquiries',
        'customer_status'
    ];
    public function user() {
        return $this->hasOne(User::class);
    }

    public function group(){
        return $this->belongsTo(Subscribers_Group::class);
    }

    // public function package(){
    //     return $this->belongsTo(Package::class,'company_package');
    // }
    // public function subscribers(){
    //     return $this->hasMany(Subscriber::class);
    // }
}
