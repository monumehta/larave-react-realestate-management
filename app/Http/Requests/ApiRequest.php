<?php


namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;

abstract class ApiRequest extends FormRequest
{
    public function validationData() {
        $this->validator->json();

    }

}