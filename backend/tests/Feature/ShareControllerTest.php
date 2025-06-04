<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ShoppingList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ShareControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function solo_dueno_puede_compartir_lista()
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $target = User::factory()->create();
        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);

        // El dueño comparte
        Sanctum::actingAs($owner);
        $response = $this->postJson("/api/lists/{$list->id}/share", [
            'email' => $target->email
        ]);
        $response->assertStatus(200)
            ->assertJson(['message' => 'Lista compartida correctamente.']);
        $this->assertTrue($list->sharedWith()->where('user_id', $target->id)->exists());

        // Un usuario que NO es dueño no puede compartir
        Sanctum::actingAs($other);
        $response = $this->postJson("/api/lists/{$list->id}/share", [
            'email' => $target->email
        ]);
        $response->assertStatus(403)
            ->assertJson(['message' => 'No autorizado']);
    }

    /** @test */
    public function no_puede_compartirse_una_lista_contigo_mismo()
    {
        $owner = User::factory()->create();
        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);

        Sanctum::actingAs($owner);
        $response = $this->postJson("/api/lists/{$list->id}/share", [
            'email' => $owner->email
        ]);
        $response->assertStatus(400)
            ->assertJson(['message' => 'No puedes compartir contigo mismo']);
    }

    /** @test */
    public function no_puede_compartirse_lista_dos_veces_con_el_mismo_usuario()
    {
        $owner = User::factory()->create();
        $target = User::factory()->create();
        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);
        $list->sharedWith()->attach($target->id);

        Sanctum::actingAs($owner);
        $response = $this->postJson("/api/lists/{$list->id}/share", [
            'email' => $target->email
        ]);
        $response->assertStatus(400)
            ->assertJson(['message' => 'Ya se ha compartido con este usuario']);
    }

    /** @test */
    public function puede_listar_usuarios_compartidos()
    {
        $owner = User::factory()->create();
        $target = User::factory()->create();
        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);
        $list->sharedWith()->attach($target->id);

        Sanctum::actingAs($owner);
        $response = $this->getJson("/api/lists/{$list->id}/shared-users");

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
        $this->assertCount(1, $response['data']);
        $this->assertEquals($target->id, $response['data'][0]['id']);
    }

    /** @test */
    public function solo_dueno_puede_listar_usuarios_compartidos()
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);

        Sanctum::actingAs($other);
        $response = $this->getJson("/api/lists/{$list->id}/shared-users");
        $response->assertStatus(403)
            ->assertJson(['message' => 'No autorizado']);
    }

    /** @test */
    public function solo_dueno_puede_revocar_acceso()
    {
        $owner = User::factory()->create();
        $target = User::factory()->create();
        $other = User::factory()->create();
        $list = ShoppingList::factory()->create(['user_id' => $owner->id]);
        $list->sharedWith()->attach($target->id);

        // Revoca correctamente
        Sanctum::actingAs($owner);
        $response = $this->deleteJson("/api/lists/{$list->id}/shared-users/{$target->id}");
        $response->assertStatus(200)
            ->assertJson(['message' => 'Acceso revocado correctamente.']);
        $this->assertFalse($list->sharedWith()->where('user_id', $target->id)->exists());

        // Un usuario que NO es dueño no puede revocar
        $list->sharedWith()->attach($target->id);
        Sanctum::actingAs($other);
        $response = $this->deleteJson("/api/lists/{$list->id}/shared-users/{$target->id}");
        $response->assertStatus(403)
            ->assertJson(['message' => 'No autorizado']);
    }
}
