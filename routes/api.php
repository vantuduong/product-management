<?php

use App\Http\Controllers\Apis\ProductController;;
use Illuminate\Support\Facades\Route;

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

Route::post('products/{product}/upload-image', [ProductController::class, 'uploadProductImage']);
Route::delete('products/{product}/remove-image/{image}', [ProductController::class, 'removeProductImage']);
Route::apiResource('products', ProductController::class);

