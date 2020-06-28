<?php

namespace App\Http\Requests\Custom;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class CustomRequest
 * @package App\Request
 * @property integer middleware_client_id the middleware added field
 * @property integer $part
 * @property $subscribers
 * @property $title
 * @property $email
 * @property $sms
 * @property $whatsup
 * @property $project_name
 * @property $address
 * @property $address2
 * @property $city
 * @property $remind
 * @property $remind_period
 * @property $remind_message
 * @property $background
 * @property $timeline
 * @property $folders
 * @property $images
 */

class ProjectRequest extends FormRequest
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
