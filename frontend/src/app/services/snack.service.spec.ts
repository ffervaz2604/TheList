import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackService } from './snack.service';

describe('SnackService', () => {
  let service: SnackService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [SnackService]
    });

    service = TestBed.inject(SnackService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar a snackBar.open con los parámetros correctos', () => {
    const spy = spyOn(snackBar, 'open').and.callThrough();

    service.show('Mensaje de prueba', 'Acción', { duration: 5000 });

    expect(spy).toHaveBeenCalledWith('Mensaje de prueba', 'Acción', jasmine.objectContaining({
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'custom-snackbar'
    }));
  });

  it('debería usar valores por defecto si no se pasan parámetros', () => {
    const spy = spyOn(snackBar, 'open').and.callThrough();

    service.show('Mensaje simple');

    expect(spy).toHaveBeenCalledWith('Mensaje simple', 'Cerrar', jasmine.objectContaining({
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'custom-snackbar'
    }));
  });
});
