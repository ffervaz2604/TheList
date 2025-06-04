import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchivedListsComponent } from './archived-lists.component';
import { ListService } from '../../services/list.service';
import { SnackService } from '../../services/snack.service';
import { of, throwError } from 'rxjs';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';

describe('ArchivedListsComponent', () => {
    let component: ArchivedListsComponent;
    let fixture: ComponentFixture<ArchivedListsComponent>;
    let mockListService: jasmine.SpyObj<ListService>;
    let mockSnackService: jasmine.SpyObj<SnackService>;

    beforeEach(async () => {
        mockListService = jasmine.createSpyObj('ListService', ['getArchived', 'unarchiveList']);
        mockSnackService = jasmine.createSpyObj('SnackService', ['show']);

        await TestBed.configureTestingModule({
            imports: [ArchivedListsComponent, TranslocoTestingModule],
            providers: [
                { provide: ListService, useValue: mockListService },
                { provide: SnackService, useValue: mockSnackService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ArchivedListsComponent);
        component = fixture.componentInstance;
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería cargar las listas archivadas correctamente', () => {
        const data = { data: [{ id: 1, name: 'Lista A', products: [] }] };
        mockListService.getArchived.and.returnValue(of(data));

        fixture.detectChanges(); // ngOnInit
        expect(component.archivedLists.length).toBe(1);
        expect(component.isLoading).toBeFalse();
    });

    it('debería manejar error al cargar listas', () => {
        mockListService.getArchived.and.returnValue(throwError(() => new Error('Error')));
        fixture.detectChanges();
        expect(component.errorMessage).toContain('No se pudieron cargar');
        expect(component.isLoading).toBeFalse();
    });

    it('debería mostrar mensaje al desarchivar una lista', () => {
        mockListService.unarchiveList.and.returnValue(of({ data: {} }));
        mockListService.getArchived.and.returnValue(of({ data: [] }));

        component.unarchiveList(1);

        expect(mockSnackService.show).toHaveBeenCalledWith('Lista desarchivada correctamente');
    });

    it('debería mostrar error si falla al desarchivar', () => {
        mockListService.unarchiveList.and.returnValue(throwError(() => new Error('Error')));
        component.unarchiveList(1);
        expect(mockSnackService.show).toHaveBeenCalledWith('No se pudo desarchivar la lista');
    });
});
