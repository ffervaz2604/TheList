<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function shoppingLists()
    {
        return $this->hasMany(ShoppingList::class);
    }

    public function sharedLists()
    {
        return $this->belongsToMany(ShoppingList::class, 'shares');
    }

    public function histories()
    {
        return $this->hasMany(History::class);
    }

    public function products()
    {
        return $this->hasManyThrough(
            \App\Models\Product::class,
            \App\Models\ShoppingList::class,
            'user_id',
            'shopping_list_id',
            'id',
            'id'
        );
    }
}
