<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $user = $request->user();

        $activeLists = $user->shoppingLists()->where('archived', false)->count();
        $pendingProducts = $user->products()->where('purchased', false)->count();
        $sharedLists = $user->sharedLists()->count();
        $completedProducts = $user->products()->where('purchased', true)->count();

        return response()->json([
            'activeLists' => $activeLists,
            'pendingProducts' => $pendingProducts,
            'sharedLists' => $sharedLists,
            'completedProducts' => $completedProducts,
        ]);
    }
}
