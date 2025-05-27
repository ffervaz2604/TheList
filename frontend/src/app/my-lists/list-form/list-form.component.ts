import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SnackService } from '../../services/snack.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-list-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslocoModule
  ],
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ListFormComponent>,
    private snack: SnackService,
    @Inject(MAT_DIALOG_DATA) public data: { name?: string }
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required]
    });
  }

  save(): void {
    if (this.form.valid) {
      this.snack.show('Lista creada correctamente');

      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
