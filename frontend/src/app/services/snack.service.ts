import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(private snackBar: MatSnackBar) { }

  show(
    message: string,
    action: string = 'Cerrar',
    config: Partial<MatSnackBarConfig> = {}
  ): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'custom-snackbar',
      ...config
    });
  }
}
