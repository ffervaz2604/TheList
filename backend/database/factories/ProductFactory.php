<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ShoppingList;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'shopping_list_id' => ShoppingList::factory(),
            'name' => $this->faker->word(),
            'quantity' => $this->faker->numberBetween(1, 5),
            'purchased' => false,
        ];
    }
}
