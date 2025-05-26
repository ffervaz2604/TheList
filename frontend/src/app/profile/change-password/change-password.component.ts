import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  form: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password_confirmation: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    return group.get('new_password')?.value === group.get('new_password_confirmation')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    this.http.put(
      'http://localhost:8000/api/change-password',
      this.form.value,
      { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` }) }
    ).subscribe({
      next: () => {
        this.successMessage = 'Contraseña actualizada correctamente.';
        setTimeout(() => this.router.navigate(['/profile']), 2000);
      },
      error: () => {
        this.errorMessage = 'Error al actualizar la contraseña.';
      }
    });
  }
}
