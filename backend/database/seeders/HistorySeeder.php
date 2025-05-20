<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\History;
use App\Models\User;
use App\Models\ShoppingList;

class HistorySeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'admin@example.com')->first();
        $list = ShoppingList::where('name', 'Lista semanal')->first();

        History::create([
            'action' => 'Creó la lista',
            'user_id' => $user->id,
            'shopping_list_id' => $list->id,
        ]);
    }
}
