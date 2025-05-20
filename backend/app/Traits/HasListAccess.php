<?php

namespace App\Traits;

use App\Models\ShoppingList;
use Illuminate\Support\Facades\Auth;

trait HasListAccess
{
    /**
     * Verifica si el usuario autenticado tiene acceso a la lista
     */
    public function userHasAccessToList($listId): bool
    {
        $user = Auth::user();

        return ShoppingList::where('id', $listId)
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhereHas('sharedWith', function ($q) use ($user) {
                        $q->where('users.id', $user->id);
                    });
            })
            ->exists();
    }
}
