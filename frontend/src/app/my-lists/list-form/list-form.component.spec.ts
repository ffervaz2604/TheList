import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListFormComponent } from './list-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackService } from '../../services/snack.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';

describe('ListFormComponent', () => {
    let component: ListFormComponent;
    let fixture: ComponentFixture<ListFormComponent>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<ListFormComponent>>;
    let mockSnackService: jasmine.SpyObj<SnackService>;

    beforeEach(async () => {
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        mockSnackService = jasmine.createSpyObj('SnackService', ['show']);

        await TestBed.configureTestingModule({
            imports: [ListFormComponent, TranslocoTestingModule, NoopAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: SnackService, useValue: mockSnackService },
                { provide: MAT_DIALOG_DATA, useValue: { name: '' } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ListFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería cerrar el diálogo sin datos al cancelar', () => {
        component.cancel();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('debería cerrar el diálogo con los datos del formulario al guardar', () => {
        component.form.setValue({ name: 'Mi Lista' });
        component.save();
        expect(mockSnackService.show).toHaveBeenCalledWith('Lista creada correctamente');
        expect(mockDialogRef.close).toHaveBeenCalledWith({ name: 'Mi Lista' });
    });

    it('no debería cerrar el diálogo si el formulario es inválido', () => {
        component.form.setValue({ name: '' });
        component.save();
        expect(mockDialogRef.close).not.toHaveBeenCalled();
        expect(mockSnackService.show).not.toHaveBeenCalled();
    });
});
