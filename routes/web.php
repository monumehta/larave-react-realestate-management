<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Auth::routes(['verify' => true]);
// Auth::routes();
Route::get('/password/success', 'SuccessController@success');
Route::get('/error/page', 'SuccessController@error');

Route::get('/{path}', 'HomeController@index')->where('path','.*');

