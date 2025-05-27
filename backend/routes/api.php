<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
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
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/lists', [ShoppingListsController::class, 'index']);
    Route::post('/lists', [ShoppingListsController::class, 'store']);
    Route::get('/lists/archived', [ShoppingListsController::class, 'archived']);
    Route::get('/lists/{id}', [ShoppingListsController::class, 'show']);
    Route::put('/lists/{id}', [ShoppingListsController::class, 'update']);
    Route::delete('/lists/{id}', [ShoppingListsController::class, 'destroy']);

    Route::post('/lists/{id}/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::post('/lists/{id}/share', [ShareController::class, 'invite']);
    Route::get('/lists/{id}/shared-users', [ShareController::class, 'sharedUsers']);
});

Route::middleware('auth:sanctum')->get('/shared-lists', function () {
    $user = auth()->user();
    $lists = $user->sharedLists()->with('products')->get();
    return response()->json($lists);
});
