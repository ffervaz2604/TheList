<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function usuario_autenticado_puede_crear_producto_en_su_lista()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $list = ShoppingList::factory()->create(['user_id' => $user->id]);

        $response = $this->postJson("/api/lists/{$list->id}/products", [
            'name' => 'Leche',
            'quantity' => 2
        ]);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Producto creado correctamente.']);

        $this->assertDatabaseHas('products', [
            'shopping_list_id' => $list->id,
            'name' => 'Leche',
            'quantity' => 2
        ]);
    }

    /** @test */
    public function usuario_no_puede_crear_producto_en_lista_ajena()
    {
        $user = User::factory()->create();
        $otro = User::factory()->create();
        Sanctum::actingAs($user);

        $list = ShoppingList::factory()->create(['user_id' => $otro->id]);

        $response = $this->postJson("/api/lists/{$list->id}/products", [
            'name' => 'Pan'
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function usuario_puede_actualizar_estado_producto_en_lista_compartida()
    {
        $owner = User::factory()->create();
        $collab = User::factory()->create();
        Sanctum::actingAs($collab);

        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);
        // Simulamos que el colaborador tiene acceso compartido
        $list->sharedWith()->attach($collab->id);

        $product = Product::factory()->create([
            'shopping_list_id' => $list->id,
            'name' => 'Arroz'
        ]);

        $response = $this->putJson("/api/products/{$product->id}", [
            'purchased' => true
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.purchased', true);
    }

    /** @test */
    public function usuario_no_puede_actualizar_producto_sin_permiso()
    {
        $owner = User::factory()->create();
        $intruso = User::factory()->create();
        Sanctum::actingAs($intruso);

        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);
        $product = Product::factory()->create(['shopping_list_id' => $list->id]);

        $response = $this->putJson("/api/products/{$product->id}", [
            'purchased' => true
        ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'No autorizado.']);
    }

    /** @test */
    public function solo_dueno_puede_eliminar_producto()
    {
        $owner = User::factory()->create();
        Sanctum::actingAs($owner);

        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);
        $product = Product::factory()->create(['shopping_list_id' => $list->id]);

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Producto eliminado.']);
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    /** @test */
    public function colaborador_no_puede_eliminar_producto()
    {
        $owner = User::factory()->create();
        $collab = User::factory()->create();
        Sanctum::actingAs($collab);

        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);
        $list->sharedWith()->attach($collab->id);

        $product = Product::factory()->create(['shopping_list_id' => $list->id]);

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(403);
    }
}
