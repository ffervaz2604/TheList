<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ShoppingList;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $list = ShoppingList::where('name', 'Lista semanal')->first();

        Product::create([
            'name' => 'Leche',
            'quantity' => 2,
            'purchased' => false,
            'shopping_list_id' => $list->id,
        ]);

        Product::create([
            'name' => 'Pan',
            'quantity' => 1,
            'purchased' => true,
            'shopping_list_id' => $list->id,
        ]);
    }
}
