<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class ForgotPasswordControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function envia_correo_recuperacion_si_email_existe()
    {
        Notification::fake();
        $user = User::factory()->create();

        $response = $this->postJson('/api/forgot-password', [
            'email' => $user->email
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Correo de recuperación enviado.']);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    /** @test */
    public function no_envia_correo_si_email_no_existe()
    {
        Notification::fake();

        $response = $this->postJson('/api/forgot-password', [
            'email' => 'noexiste@example.com'
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Correo de recuperación enviado.']);

        Notification::assertNothingSent();
    }

    /** @test */
    public function error_si_email_no_valido_en_peticion()
    {
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'noesunemail'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /** @test */
    public function puede_resetear_contraseña_con_token_valido()
    {
        Notification::fake();

        $user = User::factory()->create();

        // Mandamos la notificación y recogemos el token
        $this->postJson('/api/forgot-password', ['email' => $user->email]);
        Notification::assertSentTo($user, ResetPassword::class, function ($notification, $channels) use (&$token) {
            $token = $notification->token;
            return true;
        });

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'nueva_password123',
            'password_confirmation' => 'nueva_password123'
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Contraseña restablecida correctamente.']);
    }

    /** @test */
    public function error_al_resetear_contraseña_con_token_invalido()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => 'token-invalido',
            'password' => 'nueva_password123',
            'password_confirmation' => 'nueva_password123'
        ]);

        $response->assertStatus(500)
            ->assertJson(['message' => 'Error al restablecer contraseña.']);
    }
}
