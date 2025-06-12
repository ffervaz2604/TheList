import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-purchased-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule,TranslocoModule],
  templateUrl: './purchased-dialog.component.html',
  styleUrls: ['./purchased-dialog.component.scss'],
})
export class PurchasedDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PurchasedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { current: number; max: number }
  ) {
    this.form = this.fb.group({
      quantity: [0, [Validators.required, Validators.min(1), Validators.max(data.max - data.current)]]
    });
  }

  confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.quantity);
    }
  }
}
