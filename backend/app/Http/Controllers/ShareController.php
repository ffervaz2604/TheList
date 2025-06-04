<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Http\Request;

class ShareController extends Controller
{
    public function invite(Request $request, $listId)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $list = ShoppingList::findOrFail($listId)->fresh();

        if ((int)$list->user_id !== (int)auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $userToShare = User::where('email', $request->email)->first();

        if ($userToShare->id === auth()->id()) {
            return response()->json(['message' => 'No puedes compartir contigo mismo'], 400);
        }

        if ($list->sharedWith()->where('user_id', $userToShare->id)->exists()) {
            return response()->json(['message' => 'Ya se ha compartido con este usuario'], 400);
        }

        $list->sharedWith()->attach($userToShare->id);

        return response()->json(['message' => 'Lista compartida correctamente.']);
    }

    public function sharedUsers($listId)
    {
        $list = ShoppingList::with('sharedWith')->findOrFail($listId);

        if ((int)$list->user_id !== (int)auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json(['data' => $list->sharedWith]);
    }

    public function revoke($listId, $userId)
    {
        $list = ShoppingList::findOrFail($listId)->fresh();

        if ((int)$list->user_id !== (int)auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $list->sharedWith()->detach($userId);

        return response()->json(['message' => 'Acceso revocado correctamente.']);
    }
}
