<?php

namespace App\Http\Requests\Custom;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class CustomerRequest
 * @package App\Http\Requests\Custom
 * @property string $company_name
 * @property string $company_email
 * @property string $company_phone
 * @property $company_package
 * @property string $name
 * @property string $user_email
 * @property string $user_name
 * @property $package
 * @property $status
 */
class CustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
        ];
    }
}
