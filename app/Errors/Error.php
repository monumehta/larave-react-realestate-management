<?php


namespace App\Errors;


class Error extends ErrorBase
{
    private static $fileNotFound = [
        'error' => 'file not found'
    ];
    private static $subscriberNotFound = [
        'error' => 'subscriber not found'
    ];
    private static $projectNotFound = [
        'error' => 'project not found'
    ];
    private static $accessDenied = [
        'error' => 'access denied'
    ];

    private static $userInGroup = [
        'error' => 'user is already in this group'
    ];

    private static $userNotFound = [
        'error' => 'user not found'
    ];

    private static $incompliteData = [
        'error' => 'incomplete data: Int client_id'
    ];

    private static $fileNotFoundAndDelete = [
        'error' => 'file not found on disk. erroneous database record was deleted'
    ];
    private static $pendingAdministratorApproval = [
        'error' => 'Pending administrator approval'
    ];
    private static $packageNotFound = [
        'error' => 'Package not found'
    ];


    public static function file_not_found()
    {
        return response()->json(self::$fileNotFound, 404);
    }

    public static function file_not_found_and_delete()
    {
        return response()->json(self::$fileNotFoundAndDelete, 410);
    }

    public static function project_not_found()
    {
        return response()->json(self::$projectNotFound, 404);
    }

    public static function subscriber_not_found()
    {
        return response()->json(self::$subscriberNotFound, 404);
    }

    public static function user_already_in_group()
    {
        return response()->json(self::$userInGroup, 452);
    }

    public static function user_not_found()
    {
        return response()->json(self::$userNotFound, 404);
    }

    public static function access_denied()
    {
        return response()->json(self::$accessDenied, 403);
    }

    public static function incomplete_data()
    {
        return response()->json(self::$incompliteData, 400);
    }

    public static function not_ready_yet()
    {
        return response()->json('function not ready', 418);
    }

    public static function cant_do_this()
    {
        return response()->json('you cannot do this (most likely trying to work with other people\'s objects)', 450);
    }

    public static function group_error()
    {
        return response()->json('the group does not exist, or you cannot add to it', 418);
    }

    public static function wrong_param()
    {
        return response()->json('wrong parameter', 418);
    }

    public static function pending_administrator_approval()
    {
        return response()->json(self::$pendingAdministratorApproval, 402);
    }
    public static function blocked()
    {
        return response()->json('client is blocked', 423);
    }

    public static function mysqlException($message)
    {
        return response()->json($message, 527);
    }
    public static function packageNotFound()
    {
        return response()->json(self::$packageNotFound, 404);
    }
}