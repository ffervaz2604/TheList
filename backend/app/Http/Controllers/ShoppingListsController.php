<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use Illuminate\Http\Request;
use App\Helpers\ApiResponse;

class ShoppingListsController extends Controller
{
    public function index()
    {
        $lists = auth()->user()->shoppingLists()->with('products')->get();
        return ApiResponse::success($lists);
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

        return ApiResponse::success($list, 'Lista creada correctamente.', 201);
    }

    public function show($id)
    {
        $list = ShoppingList::with('products')->findOrFail($id);

        if ($list->user_id !== auth()->id()) {
            return ApiResponse::error('No autorizado.', [], 403);
        }

        return ApiResponse::success($list);
    }

    public function update(Request $request, $id)
    {
        $list = ShoppingList::findOrFail($id);

        if ($list->user_id !== auth()->id()) {
            return ApiResponse::error('No autorizado.', [], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'archived' => 'sometimes|boolean',
        ]);

        $list->update($request->only(['name', 'archived']));

        return ApiResponse::success($list, 'Lista actualizada.');
    }

    public function destroy($id)
    {
        $list = ShoppingList::findOrFail($id);

        if ($list->user_id !== auth()->id()) {
            return ApiResponse::error('No autorizado.', [], 403);
        }

        $list->delete();

        return ApiResponse::success(null, 'Lista eliminada.');
    }

    public function archived()
    {
        $lists = auth()->user()
            ->shoppingLists()
            ->where('archived', true)
            ->with('products')
            ->get();

        return ApiResponse::success($lists);
    }
}
