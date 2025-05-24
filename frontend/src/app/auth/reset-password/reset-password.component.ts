import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token: string = '';
  email: string = '';
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.successMessage = null;
      this.errorMessage = null;

      const payload = {
        token: this.token,
        email: this.email,
        ...this.form.value
      };

      this.authService.reset(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Contraseña actualizada correctamente. Redirigiendo...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'El enlace no es válido o ha expirado.';
        }
      });
    }
  }
}
