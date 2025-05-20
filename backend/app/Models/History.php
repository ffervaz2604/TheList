<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $fillable = ['action', 'user_id', 'shopping_list_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shoppingList()
    {
        return $this->belongsTo(ShoppingList::class);
    }
}
