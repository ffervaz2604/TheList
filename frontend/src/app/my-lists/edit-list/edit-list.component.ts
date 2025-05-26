import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { SnackService } from '../../services/snack.service';

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditListComponent>,
    private snack: SnackService,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: number; name: string; archived?: boolean }
  ) {
    this.form = this.fb.group({
      name: [data.name, [Validators.required, Validators.maxLength(255)]],
      archived: [data.archived ?? false]
    });
  }

  save(): void {
    if (this.form.valid) {
      this.snack.show('Lista actualizada correctamente');

      this.dialogRef.close({ id: this.data.id, ...this.form.value });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
