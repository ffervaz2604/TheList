<?php

namespace Database\Factories;

use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShoppingListFactory extends Factory
{
    protected $model = ShoppingList::class;

    public function definition()
    {
        return [
            'name' => $this->faker->words(2, true),
            'user_id' => User::factory(),
            'archived' => false,
        ];
    }
}
