<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Share;
use App\Models\User;
use App\Models\ShoppingList;

class ShareSeeder extends Seeder
{
    public function run(): void
    {
        $colab = User::where('email', 'colaborador@example.com')->first();
        $list = ShoppingList::where('name', 'Lista semanal')->first();

        Share::create([
            'shopping_list_id' => $list->id,
            'user_id' => $colab->id,
        ]);
    }
}
