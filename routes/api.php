<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//---------------------------------------------------
//super admin
//---------------------------------------------------
Route::group(['prefix' => 'auth', 'middleware' => ['auth:web',]], function () {
    Route::post('user', 'Api\Auth\AuthController@user');
    Route::post('logout', 'Api\Auth\AuthController@logout');
});

Route::group(['namespace' => 'Api', 'prefix' => 'client', 'middleware' => ['auth:web', 'check_admin']], 
function () {
    Route::post('/', 'ClientController@index');
    Route::post('new', 'ClientController@create');
    Route::post('show/{id}', 'ClientController@show');
    Route::post('update/{id}', 'ClientController@update');
    Route::post('delete/{id}', 'ClientController@delete');
    Route::post('/search', 'ClientController@search');
    Route::post('/insert', 'ClientController@insertImage');
    Route::post('deletesubscriber/{id}', 'ClientController@deleteSubscriber');
    
    
});

Route::group(['namespace' => 'Api', 'prefix' => 'customer' , 'middleware' => ['auth:web', 'check_admin']], 
function () {
    Route::post('/', 'CustomerController@index');
    Route::post('new', 'CustomerController@create');
    Route::post('import', 'CustomerController@import');
    Route::post('show/{id}', 'CustomerController@show');
    Route::post('update/{id}', 'CustomerController@update');
    Route::post('updateGroup/{id}', 'CustomerController@updateGroup');
    Route::post('delete/{id}', 'CustomerController@delete');
    Route::post('customerByClient/{id}', 'CustomerController@customerByClient');
    Route::post('customerByClientAndGroup/{id}', 'CustomerController@customerByClientAndGroup');
    Route::post('customerByProjectAndGroup/{id}', 'CustomerController@customerByProjectAndGroup');    
    Route::post('customerByProject/{id}', 'CustomerController@customerByProject');
    Route::post('search', 'CustomerController@search');
    Route::post('search/{id}', 'CustomerController@searchByClient');
    Route::post('updateInquiry/{id}', 'CustomerController@updateInquiry');
});

Route::group(['namespace' => 'Api', 'prefix' => 'timelines' , 'middleware' => ['auth:web', 'check_admin']], 
 function () {
    Route::post('/', 'TimelineController@index');
    Route::post('show/{id}', 'TimelineController@show');
    Route::post('timeineByClient/{id}', 'TimelineController@timeineByClient');
    Route::post('new', 'TimelineController@newTimeline');
    Route::post('update/{id}', 'TimelineController@update');
    Route::post('delete/{id}', 'TimelineController@delete');
    Route::post('updateSteps/{id}', 'TimelineController@updateSteps');
    
});

Route::group(['namespace' => 'Api', 'prefix' => 'groups', 'middleware' => ['auth:web', 'check_admin',]],  function () {
    Route::post('/', 'GroupController@index');
    Route::post('show/{id}', 'GroupController@show');
    Route::post('create', 'GroupController@store');
    Route::post('getgroups/{id}', 'GroupController@allGroupsForProject');
    Route::post('update/{id}', 'GroupController@update');
    Route::post('delete/{id}', 'GroupController@delete');
});

Route::group(['namespace' => 'Api', 'prefix' => 'project', 'middleware' => ['auth:web', 'check_admin',]],  
 function () {
    Route::post('/', 'ProjectController@index');
    Route::post('show/{id}', 'ProjectController@show');
    Route::post('getpart/{id}', 'ProjectController@getPart');
    Route::post('projectByClient/{id}', 'ProjectController@projectByClient');
    Route::post('search', 'ProjectController@search');

    Route::post('new', 'ProjectController@create');
    Route::post('duplicate/{id}', 'ProjectController@duplicate');
    Route::post('save', 'ProjectController@store');
    Route::post('update/{id}', 'ProjectController@update');
    Route::post('delete/{id}', 'ProjectController@delete');
    Route::post('sendnews/{id}', 'ProjectController@sendNews');
    Route::post('newsByClient/{id}', 'ProjectController@newsByClient');
    Route::post('news/change/{id}', 'ProjectController@updateNewsItem');
    Route::post('updateNewsTime/{id}', 'ProjectController@updateNewsTime');

    Route::post('insert', 'ProjectController@insertImage');
});

Route::group(['namespace' => 'Api', 'prefix' => 'file', 'middleware' => ['auth:web', 'check_admin',]],  
function () {
    Route::post('get/{id}', 'FileController@getFile');
    Route::post('get2/{id}', 'FileController@getFile2');
    Route::post('getfolderfiles/{id}', 'FileController@getFolderFiles');
    Route::post('getFilesForClient/{id}', 'FileController@getFilesForClient');
    Route::post('getFilesForProject/{id}', 'FileController@getFilesForProject');
    
    Route::post('getsubsfolderfiles', 'FileController@getSubsFolderFiles');
    Route::post('rename/{id}', 'FileController@updateFileName');
    Route::post('upload', 'FileController@store');
    Route::post('delete/{id}', 'FileController@delete');
    Route::post('insert', 'ProjectController@insertImage');
});

Route::group(['namespace' => 'Api', 'prefix' => 'folder', 'middleware' => ['auth:web', 'check_admin',]],  
 function () {
    Route::post('delete/{id}', 'FolderController@delete');
    Route::post('rename/{id}', 'FolderController@update');
    Route::post('new', 'FolderController@store');
    Route::post('getzip/{id}', 'FolderController@getFolderZip');
    Route::post('projectFolders/{id}', 'FolderController@projectFolders');
    
});

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group([
    'namespace' => 'Api',
    'prefix' => 'password'
], function () {

    Route::post('request', 'PasswordResetController@create');
    Route::post('find', 'PasswordResetController@find');
    Route::post('reset', 'PasswordResetController@reset');
});

Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', 'Api\Auth\AuthController@login');
    Route::post('signup', 'Api\Auth\AuthController@signup');
    Route::get('noauth', 'Api\Auth\AuthController@noauth');

    Route::group([
        'middleware' => ['auth:api', 'verified_phone']
    ], function () {
        // Route::post('logout', 'Api\Auth\AuthController@logout');
        // Route::post('user', 'Api\Auth\AuthController@user');
    });
});
Route::group(['namespace' => 'Api', 'prefix' => 'invite'], function () {
    Route::post('/pwdupd', 'InviteController@newPassword');
    Route::post('/{id}', 'InviteController@checkInviteLink');
});

Route::group(['namespace' => 'Api', 'prefix' => 'user', 'middleware' => ['auth:api', 'checkStatus',]], function () {
    Route::post('updatemail', 'UserController@updateMail');
    Route::post('updatepassword', 'UserController@updatePassword');
    Route::post('updateusername', 'UserController@updateUserName');
});


Route::group(['namespace' => 'Api', 'prefix' => 'packages', 'middleware' => ['auth:api', 'check_admin']], function () {
    Route::post('/', 'PackageController@index');
    Route::post('get/{id}', 'PackageController@getPackage');
    Route::post('update/{id}', 'PackageController@updatePackage');
    Route::post('new', 'PackageController@newPackage');
    Route::post('delete/{id}', 'PackageController@deletePackage');

});

Route::group(['namespace' => 'Api', 'prefix' => 'backgrounds', 'middleware' => ['auth:api', 'check_admin']], function () {
    Route::middleware('check_admin')->post('upload', 'BackgroundController@store');
    Route::middleware('check_admin')->post('update/{id}', 'BackgroundController@update');
    Route::middleware('check_admin')->post('delete/{id}', 'BackgroundController@delete');
});



Route::group(['middleware' => ['auth:api','admin_or_client','checkStatus'], 'namespace' => 'Api'], function () {

    //---------------------------------------------------
    //background
    //---------------------------------------------------

    Route::group(['prefix' => 'backgrounds'], function () {
        Route::post('/', 'BackgroundController@index');
        Route::post('get/{id}', 'BackgroundController@show');
        Route::post('getbg/{id}', 'BackgroundController@getBackground');
        Route::post('getpreview/{id}', 'BackgroundController@getPreview');
    });

    //---------------------------------------------------
    //client
    //---------------------------------------------------
    Route::group(['prefix' => 'client'], function () {
        Route::post('update', 'ClientController@clientUpdate');
        Route::post('getinfo', 'ClientController@editInfo');
        Route::post('logoupload', 'ClientController@logoUpload');

        // Route::post('deletesubscriber/{id}', 'ClientController@deleteSubscriber');
    });



    

    //---------------------------------------------------
    //images
    //---------------------------------------------------

    Route::group(['prefix' => 'images'], function () {
//        Route::post('project/{id}', 'ImageController@index');
//        Route::post('get/{id}', 'ImageController@show');
//        Route::post('upload', 'ImageController@store');
        Route::post('delete/{id}', 'ImageController@delete');
    });


    //---------------------------------------------------
    //invite
    //---------------------------------------------------

//    Route::group(['prefix' => 'invite'], function () {
//        Route::post('upload', 'InviteController@parse');
//        Route::post('subscribers', 'InviteController@inviteSubs');
//    });

    //---------------------------------------------------
    //news
    //---------------------------------------------------

    Route::group(['prefix' => 'news',], function () {
        Route::post('project/{id}', 'NewsController@index');
        Route::post('show/{id}', 'NewsController@show');
        Route::post('create', 'NewsController@store');
        Route::post('update/{id}', 'NewsController@update');
        Route::post('delete/{id}', 'NewsController@delete');
    });


    //---------------------------------------------------
    //subscribers
    //---------------------------------------------------

    Route::group(['prefix' => 'subscribers'], function () {
        Route::post('client', 'SubscribersController@clientIndex');
        Route::post('project/{id}', 'SubscribersController@projectIndex');

        Route::post('regroup', 'SubscribersController@regroup');
        Route::post('show/{id}', 'SubscribersController@show');
        Route::post('create', 'SubscribersController@store');
        Route::post('update/{id}', 'SubscribersController@update');
        Route::post('delete/{id}', 'SubscribersController@delete');
        Route::post('upload', 'InviteController@parse');
        Route::post('invite', 'InviteController@inviteSubs');
    });

    //---------------------------------------------------
    //timelines
    //---------------------------------------------------

   


});

//---------------------------------------------------
//subscribers routes
//---------------------------------------------------

Route::group(['namespace' => 'Api', 'prefix' => 'subscriber', 'middleware' => ['auth:api', 'checkStatus',]], function () {
    Route::post('/', 'SingleSubscriberController@index');
    Route::post('show/{id}', 'SingleSubscriberController@show');
    Route::post('sendmessage', 'SingleSubscriberController@sendMessageForManager');
    Route::post('upload', 'SingleSubscriberController@uploadFile');
    Route::post('deletefile/{id}', 'SingleSubscriberController@deleteFile');
    Route::post('showfolderfiles', 'SingleSubscriberController@showFilesInFolder');
    Route::post('createremind', 'SingleSubscriberController@createRemind');
    Route::post('getlogo', 'SingleSubscriberController@getLogo');

});
Route::group(['namespace' => 'Api', 'prefix' => 'subscriber'], function (){
    Route::post('invitecheck/{link}', 'InviteController@checkInviteLink');
    Route::post('firstpassword', 'InviteController@newPassword');
});
Route::group(['namespace' => 'Api', 'prefix' => 'client', 'middleware' => ['auth:api', 'admin_or_client' ]], function () {
    Route::post('getpackages', 'ClientController@getPackages');
    Route::post('selectpackage', 'ClientController@selectPackage');
    Route::post('getlogo', 'ClientController@getLogo');
});

//------------------------------
//------for all ---------------
//------------------------------
Route::group(['middleware' => ['auth:api']], function () {
    Route::post('backgrounds/getbg/{id}', 'Api\BackgroundController@getBackground');

});



