import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  isLoading = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      role: [{ value: '', disabled: true }]
    });

    this.http.get<any>('http://localhost:8000/api/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (user) => {
        this.form.patchValue(user);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el perfil';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    this.http.put('http://localhost:8000/api/profile', this.form.getRawValue(), {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => this.successMessage = 'Perfil actualizado con éxito',
      error: () => this.errorMessage = 'Error al actualizar el perfil'
    });
  }

  cambiarContrasena() {
    alert('Redirigir a formulario de cambio de contraseña');
  }
}