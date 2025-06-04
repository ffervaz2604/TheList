import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditListComponent } from './edit-list.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SnackService } from '../../services/snack.service';

describe('EditListComponent', () => {
    let component: EditListComponent;
    let fixture: ComponentFixture<EditListComponent>;
    let mockSnackService: jasmine.SpyObj<SnackService>;
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<EditListComponent>>;

    beforeEach(async () => {
        mockSnackService = jasmine.createSpyObj('SnackService', ['show']);
        mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [
                EditListComponent,
                ReactiveFormsModule,
                TranslocoTestingModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: SnackService, useValue: mockSnackService },
                { provide: MatDialogRef, useValue: mockDialogRef },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: { id: 1, name: 'Lista de prueba', archived: false }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería cerrar el diálogo con datos al guardar si el formulario es válido', () => {
        component.form.setValue({ name: 'Nueva lista', archived: true });
        component.save();

        expect(mockSnackService.show).toHaveBeenCalledWith('Lista actualizada correctamente');
        expect(mockDialogRef.close).toHaveBeenCalledWith({
            id: 1,
            name: 'Nueva lista',
            archived: true
        });
    });

    it('no debería cerrar el diálogo si el formulario es inválido', () => {
        component.form.setValue({ name: '', archived: false });
        component.save();

        expect(mockSnackService.show).not.toHaveBeenCalled();
        expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('debería cerrar el diálogo sin datos al cancelar', () => {
        component.cancel();
        expect(mockDialogRef.close).toHaveBeenCalledWith();
    });
});
