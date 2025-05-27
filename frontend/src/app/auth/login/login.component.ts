import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.serverError = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.token) {
            localStorage.setItem('token', res.token);

            this.authService.getProfile().subscribe({
              next: (user: User) => {
                this.userService.set(user);
                this.router.navigate(['/dashboard']);
              },
              error: () => {
                this.isLoading = false;
                this.serverError = 'Error al cargar el perfil.';
              }
            });
          } else {
            this.isLoading = false;
            this.serverError = 'Token no recibido del servidor.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.serverError = err.status === 401
            ? 'Correo o contraseña incorrectos.'
            : 'Ocurrió un error. Intenta de nuevo.';
          console.error('Error en login:', err);
        }
      });
    }
  }
}
