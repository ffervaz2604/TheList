import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyListsComponent } from './my-lists.component';
import { of, throwError } from 'rxjs';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';
import { MatDialog } from '@angular/material/dialog';
import { SnackService } from '../../services/snack.service';
import { ListService } from '../../services/list.service';

describe('MyListsComponent', () => {
    let component: MyListsComponent;
    let fixture: ComponentFixture<MyListsComponent>;
    let mockListService: jasmine.SpyObj<ListService>;
    let mockDialog: jasmine.SpyObj<MatDialog>;
    let mockSnack: jasmine.SpyObj<SnackService>;

    beforeEach(async () => {
        mockListService = jasmine.createSpyObj('ListService', ['getAll', 'delete', 'create', 'update', 'shareList']);
        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
        mockSnack = jasmine.createSpyObj('SnackService', ['show']);

        await TestBed.configureTestingModule({
            imports: [MyListsComponent, TranslocoTestingModule],
            providers: [
                { provide: ListService, useValue: mockListService },
                { provide: MatDialog, useValue: mockDialog },
                { provide: SnackService, useValue: mockSnack }
            ]
        }).compileComponents();
    });

    it('debería crear el componente', () => {
        mockListService.getAll.and.returnValue(of({ data: [] }));
        fixture = TestBed.createComponent(MyListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('debería cargar las listas al iniciar', () => {
        mockListService.getAll.and.returnValue(of({ data: [{ id: 1, name: 'Lista 1', products: [] }] }));

        fixture = TestBed.createComponent(MyListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.lists.length).toBe(1);
    });

    it('debería mostrar mensaje de error si falla al cargar listas', () => {
        mockListService.getAll.and.returnValue(throwError(() => new Error('Error de carga')));

        fixture = TestBed.createComponent(MyListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.errorMessage).toBe('No se pudieron cargar tus listas.');
    });

    it('debería eliminar una lista', () => {
        mockListService.getAll.and.returnValue(of({ data: [{ id: 1, name: 'Test List', products: [] }] }));
        mockListService.delete.and.returnValue(of({}));
        mockDialog.open.and.returnValue({
            afterClosed: () => of(true)
        } as any);

        fixture = TestBed.createComponent(MyListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.deleteList(1);

        expect(mockListService.delete).toHaveBeenCalledWith(1);
        expect(mockSnack.show).toHaveBeenCalledWith('Lista eliminada correctamente');
    });
});
