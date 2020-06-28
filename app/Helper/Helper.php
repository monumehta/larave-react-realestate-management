<?php


namespace App\Helper;


use App\User;

class Helper
{
    private static $client_id;
    private static $client_user_id;

    public static function setId(int $client_id = null)
    {
        $user = User::auth();
        switch ($user->type) {
            case User::$SUBSCRIBER:
                self::$client_id = $user->client_id;
                break;
            case User::$CLIENT:
                self::$client_id = $user->client_id;
                self::$client_user_id = $user->id;
                break;
            case User::$ADMIN:
                self::$client_id = $client_id;
                $user_temp = User::where([
                    ['client_id', '=', $client_id],
                    ['type', '=', 1],
                ])->select(['id'])->first();
                self::$client_user_id = !is_null($user_temp) ? $user_temp->id : null
;
                break;
            default:
                return false;
        }
        return true;
    }

    public static function getClientId():?int
    {
        return self::$client_id;
    }
}
