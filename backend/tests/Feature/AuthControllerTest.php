<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function registro_exitoso()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Juan Perez',
            'email' => 'juan@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'colaborador'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role']]);

        $this->assertDatabaseHas('users', [
            'email' => 'juan@test.com',
            'role' => 'colaborador'
        ]);
    }

    /** @test */
    public function registro_falla_por_email_duplicado()
    {
        User::factory()->create(['email' => 'juan@test.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Otro Usuario',
            'email' => 'juan@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function login_exitoso()
    {
        User::factory()->create([
            'email' => 'test@login.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@login.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token']);
    }

    /** @test */
    public function login_falla_con_credenciales_invalidas()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'incorrecto@test.com',
            'password' => 'malpassword'
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Unauthorized']);
    }

    /** @test */
    public function obtiene_perfil_usuario_autenticado()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJson(['email' => $user->email]);
    }

    /** @test */
    public function actualiza_perfil_correctamente()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/profile', [
            'name' => 'Nuevo Nombre',
            'email' => 'nuevo@test.com'
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Perfil actualizado']);

        $this->assertDatabaseHas('users', ['email' => 'nuevo@test.com']);
    }

    /** @test */
    public function cambia_contrasena_exitosamente()
    {
        $user = User::factory()->create(['password' => bcrypt('oldpassword')]);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/change-password', [
            'current_password' => 'oldpassword',
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123'
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Contraseña actualizada con éxito.']);
    }

    /** @test */
    public function cambio_contrasena_falla_contrasena_incorrecta()
    {
        $user = User::factory()->create(['password' => bcrypt('oldpassword')]);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/change-password', [
            'current_password' => 'wrongpassword',
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123'
        ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'La contraseña actual no es correcta.']);
    }

    /** @test */
    public function logout_usuario_autenticado()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Sesión cerrada correctamente.']);
    }
}
