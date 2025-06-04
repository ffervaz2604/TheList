import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareListComponent } from './share-list.component';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListService } from '../../services/list.service';
import { SnackService } from '../../services/snack.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('ShareListComponent', () => {
    let component: ShareListComponent;
    let fixture: ComponentFixture<ShareListComponent>;
    let listServiceSpy: jasmine.SpyObj<ListService>;
    let snackSpy: jasmine.SpyObj<SnackService>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ShareListComponent>>;

    beforeEach(async () => {
        listServiceSpy = jasmine.createSpyObj('ListService', [
            'shareList',
            'getSharedUsers',
            'revokeShare'
        ]);
        snackSpy = jasmine.createSpyObj('SnackService', ['show']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        // 👇 Este mock debe ir ANTES de crear el componente
        listServiceSpy.getSharedUsers.and.returnValue(of({ data: [] }));

        await TestBed.configureTestingModule({
            imports: [ShareListComponent, ReactiveFormsModule, TranslocoTestingModule],
            providers: [
                { provide: ListService, useValue: listServiceSpy },
                { provide: SnackService, useValue: snackSpy },
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: MAT_DIALOG_DATA, useValue: { listId: 1 } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ShareListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería compartir una lista correctamente', () => {
        component.form.setValue({ email: 'test@example.com' });
        listServiceSpy.shareList.and.returnValue(of({ message: 'OK' }));
        listServiceSpy.getSharedUsers.and.returnValue(of({ data: [] }));

        component.share();

        expect(listServiceSpy.shareList).toHaveBeenCalledWith(1, 'test@example.com');
        expect(snackSpy.show).toHaveBeenCalledWith('Lista compartida correctamente');
    });

    it('debería mostrar error si falla al compartir lista', () => {
        component.form.setValue({ email: 'error@example.com' });
        listServiceSpy.shareList.and.returnValue(throwError(() => new Error('Error')));

        component.share();

        expect(snackSpy.show).toHaveBeenCalledWith('No se pudo compartir la lista');
    });

    it('debería revocar acceso a un usuario confirmado', () => {
        const fakeDialog = {
            afterClosed: () => of(true)
        };

        // @ts-ignore
        spyOn(component['dialog'], 'open').and.returnValue(fakeDialog);

        component.sharedUsers = [{ id: 2, email: 'usuario@test.com' }];
        listServiceSpy.revokeShare.and.returnValue(of({ message: 'OK' }));

        component.revoke(2);

        expect(listServiceSpy.revokeShare).toHaveBeenCalledWith(1, 2);
        expect(snackSpy.show).toHaveBeenCalledWith('Acceso revocado');
    });

    it('debería cancelar la acción de compartir', () => {
        component.cancel();
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });
});
