<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'quantity', 'purchased', 'shopping_list_id'];

    public function shoppingList()
    {
        return $this->belongsTo(ShoppingList::class);
    }
}
