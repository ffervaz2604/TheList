<?php

namespace Database\Seeders;

use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShoppingListSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'admin@example.com')->first();

        ShoppingList::create([
            'name' => 'Lista semanal',
            'user_id' => $user->id,
            'archived' => false,
        ]);

        ShoppingList::create([
            'name' => 'Fiesta cumpleaños',
            'user_id' => $user->id,
            'archived' => false,
        ]);
    }
}
