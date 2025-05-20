<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Http\Request;
use App\Helpers\ApiResponse;

class ShareController extends Controller
{
    public function invite(Request $request, $listId)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $list = ShoppingList::findOrFail($listId);

        if ($list->user_id !== auth()->id()) {
            return ApiResponse::error('No autorizado.', [], 403);
        }

        $userToShare = User::where('email', $request->email)->first();

        if ($userToShare->id === auth()->id()) {
            return ApiResponse::error('No puedes compartir contigo mismo.', [], 400);
        }

        if ($list->sharedWith()->where('user_id', $userToShare->id)->exists()) {
            return ApiResponse::error('Ya se ha compartido con este usuario.', [], 400);
        }

        $list->sharedWith()->attach($userToShare->id);

        return ApiResponse::success(null, 'Lista compartida correctamente.');
    }
}
