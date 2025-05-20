<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store(Request $request, $listId)
    {
        $list = ShoppingList::findOrFail($listId);

        if ($list->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $product = $list->products()->create([
            'name' => $validated['name'],
            'quantity' => $validated['quantity'] ?? 1,
            'purchased' => false,
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $list = $product->shoppingList;

        if ($list->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'quantity' => 'sometimes|integer|min:1',
            'purchased' => 'sometimes|boolean',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $list = $product->shoppingList;

        if ($list->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado']);
    }
}
