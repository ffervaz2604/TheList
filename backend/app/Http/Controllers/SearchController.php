<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ShoppingList;
use App\Models\Product;

class SearchController extends Controller
{
    public function searchLists(Request $request)
    {
        $query = $request->query('query', '');

        $lists = ShoppingList::where('user_id', auth()->id())
            ->where('name', 'like', "%{$query}%")
            ->get(['id', 'name']);

        return response()->json($lists);
    }

    public function searchProducts(Request $request)
    {
        $query = $request->query('query', '');

        $products = Product::whereHas('shoppingList', function ($q) {
            $q->where('user_id', auth()->id());
        })
            ->where('name', 'like', "%{$query}%")
            ->get(['id', 'name']);

        return response()->json($products);
    }
}
