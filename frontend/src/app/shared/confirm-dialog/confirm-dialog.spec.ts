import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

    beforeEach(async () => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [ConfirmDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        title: 'Eliminar elemento',
                        message: '¿Estás seguro?',
                        cancelText: 'Cancelar',
                        confirmText: 'Confirmar'
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería mostrar título y mensaje correctamente', () => {
        const title = fixture.debugElement.query(By.css('h2')).nativeElement.textContent;
        const message = fixture.debugElement.query(By.css('mat-dialog-content')).nativeElement.textContent;

        expect(title).toContain('Eliminar elemento');
        expect(message).toContain('¿Estás seguro?');
    });

    it('debería cerrar el diálogo con "true" al confirmar', () => {
        component.confirm();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });

    it('debería cerrar el diálogo con "false" al cancelar', () => {
        component.cancel();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    });
});
