<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ShoppingList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ShoppingListsControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function muestra_listas_del_usuario()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Crea dos listas propias y una de otro usuario
        $listasPropias = ShoppingList::factory()->count(2)->create(['user_id' => $user->id]);
        $otro = User::factory()->create();
        ShoppingList::factory()->create(['user_id' => $otro->id]);

        $response = $this->getJson('/api/lists');
        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
        $this->assertCount(2, $response['data']);
    }

    /** @test */
    public function puede_crear_lista()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/lists', [
            'name' => 'Mercadona'
        ]);

        $response->assertStatus(201)
            ->assertJson(['message' => 'Lista creada correctamente.']);
        $this->assertDatabaseHas('shopping_lists', [
            'user_id' => $user->id,
            'name' => 'Mercadona'
        ]);
    }

    /** @test */
    public function solo_puede_ver_su_lista()
    {
        $user = User::factory()->create();
        $otro = User::factory()->create();
        Sanctum::actingAs($user);

        $listaPropia = ShoppingList::factory()->create(['user_id' => $user->id]);
        $listaAjena = ShoppingList::factory()->create(['user_id' => $otro->id]);

        // Puede ver la suya
        $response = $this->getJson("/api/lists/{$listaPropia->id}");
        $response->assertStatus(200)
            ->assertJsonStructure(['data']);

        // No puede ver la ajena
        $response = $this->getJson("/api/lists/{$listaAjena->id}");
        $response->assertStatus(403);
    }

    /** @test */
    public function puede_actualizar_su_lista()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $lista = ShoppingList::factory()->create(['user_id' => $user->id, 'archived' => false]);

        $response = $this->putJson("/api/lists/{$lista->id}", [
            'name' => 'Alcampo',
            'archived' => true
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Lista actualizada.']);

        $this->assertDatabaseHas('shopping_lists', [
            'id' => $lista->id,
            'name' => 'Alcampo',
            'archived' => true
        ]);
    }

    /** @test */
    public function no_puede_actualizar_lista_ajena()
    {
        $user = User::factory()->create();
        $otro = User::factory()->create();
        Sanctum::actingAs($user);

        $listaAjena = ShoppingList::factory()->create(['user_id' => $otro->id]);

        $response = $this->putJson("/api/lists/{$listaAjena->id}", [
            'name' => 'Alcampo'
        ]);
        $response->assertStatus(403);
    }

    /** @test */
    public function puede_eliminar_su_lista()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $lista = ShoppingList::factory()->create(['user_id' => $user->id]);
        $response = $this->deleteJson("/api/lists/{$lista->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Lista eliminada.']);
        $this->assertDatabaseMissing('shopping_lists', ['id' => $lista->id]);
    }

    /** @test */
    public function no_puede_eliminar_lista_ajena()
    {
        $user = User::factory()->create();
        $otro = User::factory()->create();
        Sanctum::actingAs($user);

        $listaAjena = ShoppingList::factory()->create(['user_id' => $otro->id]);
        $response = $this->deleteJson("/api/lists/{$listaAjena->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function puede_ver_solo_listas_archivadas()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        ShoppingList::factory()->create(['user_id' => $user->id, 'archived' => true]);
        ShoppingList::factory()->create(['user_id' => $user->id, 'archived' => false]);

        $response = $this->getJson('/api/lists/archived');
        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
        $this->assertCount(1, $response['data']);
    }
}
