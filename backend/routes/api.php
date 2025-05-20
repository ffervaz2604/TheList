<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\ShoppingListsController;

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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/lists', [ShoppingListsController::class, 'index']);
    Route::post('/lists', [ShoppingListsController::class, 'store']);
    Route::get('/lists/{id}', [ShoppingListsController::class, 'show']);
    Route::put('/lists/{id}', [ShoppingListsController::class, 'update']);
    Route::delete('/lists/{id}', [ShoppingListsController::class, 'destroy']);

    Route::post('/lists/{id}/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::post('/lists/{id}/share', [ShareController::class, 'invite']);
});
