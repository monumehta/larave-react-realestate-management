<?php

namespace App\Http\Requests\Custom;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class FileRequest
 * @package App\Http\Requests\Custom
 * @property $project_id
 * @property $subscriber_id
 * @property $file_name
 */
class FileRequest extends FormRequest
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
