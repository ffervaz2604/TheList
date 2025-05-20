<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Share extends Model
{
    protected $fillable = ['shopping_list_id', 'user_id'];

    public function shoppingList()
    {
        return $this->belongsTo(ShoppingList::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
