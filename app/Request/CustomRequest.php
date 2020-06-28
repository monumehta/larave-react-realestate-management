<?php


namespace App\Request;


use Illuminate\Http\Request;

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
 */
class CustomRequest extends Request
{

}