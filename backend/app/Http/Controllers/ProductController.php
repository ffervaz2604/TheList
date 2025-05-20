<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShoppingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Verifica si el usuario autenticado tiene acceso a la lista
     */
    private function userHasAccessToList($listId)
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

    /**
     * Crear producto en una lista
     */
    public function store(Request $request, $listId)
    {
        if (!$this->userHasAccessToList($listId)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'nullable|integer',
        ]);

        $product = Product::create([
            'list_id' => $listId,
            'name' => $request->name,
            'quantity' => $request->quantity ?? 1,
            'purchased' => false,
        ]);

        return response()->json($product, 201);
    }

    /**
     * Actualizar producto
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if (!$this->userHasAccessToList($product->list_id)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'quantity' => 'sometimes|integer',
            'purchased' => 'sometimes|boolean',
        ]);

        $product->update($request->only(['name', 'quantity', 'purchased']));

        return response()->json($product);
    }

    /**
     * Eliminar producto (solo dueño)
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->list->user_id !== Auth::id()) {
            return response()->json(['message' => 'Solo el propietario puede eliminar productos.'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado.']);
    }
}
