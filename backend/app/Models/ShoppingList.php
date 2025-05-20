<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingList extends Model
{
    protected $fillable = ['name', 'user_id', 'archived'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function sharedWith()
    {
        return $this->belongsToMany(User::class, 'shares');
    }

    public function histories()
    {
        return $this->hasMany(History::class);
    }
}
