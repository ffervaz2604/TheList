<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ShoppingListsController extends Controller
{
    public function index()
    {
        $lists = auth()->user()->shoppingLists()->with('products')->get();
        return response()->json($lists);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $list = auth()->user()->shoppingLists()->create([
            'name' => $request->name,
            'archived' => false
        ]);

        return response()->json($list, 201);
    }

    public function show($id)
    {
        $list = ShoppingList::with('products')->findOrFail($id);

        if ($list->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($list);
    }

    public function update(Request $request, $id)
    {
        $list = ShoppingList::findOrFail($id);

        if ($list->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'archived' => 'sometimes|boolean',
        ]);

        $list->update($request->only(['name', 'archived']));

        return response()->json($list);
    }

    public function destroy($id)
    {
        $list = ShoppingList::findOrFail($id);

        if ($list->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $list->delete();

        return response()->json(['message' => 'Lista eliminada.']);
    }
}
