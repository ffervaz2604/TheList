import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ListService } from '../../services/list.service';
import { SnackService } from '../../services/snack.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-share-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './share-list.component.html'
})
export class ShareListComponent {
  form: FormGroup;
  sharedUsers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ShareListComponent>,
    private listService: ListService,
    private snackbar: SnackService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { listId: number }
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.loadSharedUsers();
  }

  share(): void {
    if (this.form.valid) {
      const email = this.form.value.email;
      this.listService.shareList(this.data.listId, email).subscribe({
        next: () => {
          this.snackbar.show('Lista compartida correctamente');
          this.form.reset();
          this.loadSharedUsers();
        },
        error: () => {
          this.snackbar.show('No se pudo compartir la lista');
        }
      });
    }
  }

  loadSharedUsers(): void {
    this.listService.getSharedUsers(this.data.listId).subscribe({
      next: (res) => {
        this.sharedUsers = res.data;
      }
    });
  }

  revoke(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar acceso',
        message: '¿Estás seguro de eliminar el acceso de este usuario?',
        confirmText: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.listService.revokeShare(this.data.listId, userId).subscribe({
          next: () => {
            this.sharedUsers = this.sharedUsers.filter(u => u.id !== userId);
            this.snackbar.show('Acceso revocado');
          },
          error: () => {
            this.snackbar.show('No se pudo revocar el acceso');
          }
        });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
