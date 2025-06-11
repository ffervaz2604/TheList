<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShoppingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasListAccess;
use App\Helpers\ApiResponse;

class ProductController extends Controller
{
    use HasListAccess;

    /**
     * Crear producto en una lista
     */
    public function store(Request $request, $listId)
    {
        if (!$this->userHasAccessToList($listId)) {
            return ApiResponse::error('No autorizado.', [], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'nullable|integer',
        ]);

        $product = Product::create([
            'shopping_list_id' => $listId,
            'name' => $request->name,
            'quantity' => $request->quantity ?? 1,
            'purchased' => false,
        ]);

        return ApiResponse::success($product, 'Producto creado correctamente.', 201);
    }

    /**
     * Actualizar producto
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $list = $product->shoppingList;

        $user = auth()->user();
        $hasAccess = $list->user_id === $user->id || $list->sharedWith()->where('user_id', $user->id)->exists();

        if (!$hasAccess) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate([
            'purchased' => 'sometimes|boolean'
        ]);

        $product->update($request->only(['purchased']));

        return response()->json(['data' => $product]);
    }

    /**
     * Eliminar producto (solo dueño)
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->load('shoppingList');

        if ((int)$product->shoppingList->user_id !== (int)auth()->id()) {
            return ApiResponse::error('No autorizado para eliminar.', [], 403);
        }

        $product->delete();

        return ApiResponse::success(null, 'Producto eliminado.');
    }

    public function updateQuantityPurchased(Request $request, ShoppingList $list, Product $product)
    {
        if ($product->shopping_list_id !== $list->id) {
            return ApiResponse::error('Producto no pertenece a la lista.', [], 403);
        }

        if ($list->user_id !== auth()->id()) {
            return ApiResponse::error('No autorizado para modificar.', [], 403);
        }

        $validated = $request->validate([
            'quantity_purchased' => ['required', 'integer', 'min:0', 'lte:' . $product->quantity],
        ]);

        $product->quantity_purchased = $validated['quantity_purchased'];
        $product->purchased = $product->quantity_purchased >= $product->quantity;
        $product->save();

        return ApiResponse::success($product, 'Cantidad comprada actualizada correctamente.');
    }
}
