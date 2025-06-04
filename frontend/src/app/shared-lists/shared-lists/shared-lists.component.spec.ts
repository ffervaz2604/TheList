import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedListsComponent } from './shared-lists.component';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';
import { SharedListService } from '../../services/shared.service';
import { ListService } from '../../services/list.service';
import { SnackService } from '../../services/snack.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SharedListsComponent', () => {
    let component: SharedListsComponent;
    let fixture: ComponentFixture<SharedListsComponent>;
    let sharedListServiceSpy: jasmine.SpyObj<SharedListService>;
    let listServiceSpy: jasmine.SpyObj<ListService>;
    let snackSpy: jasmine.SpyObj<SnackService>;

    beforeEach(async () => {
        sharedListServiceSpy = jasmine.createSpyObj('SharedListService', ['getSharedLists']);
        listServiceSpy = jasmine.createSpyObj('ListService', ['updateProduct']);
        snackSpy = jasmine.createSpyObj('SnackService', ['show']);

        await TestBed.configureTestingModule({
            imports: [SharedListsComponent, TranslocoTestingModule, NoopAnimationsModule],
            providers: [
                { provide: SharedListService, useValue: sharedListServiceSpy },
                { provide: ListService, useValue: listServiceSpy },
                { provide: SnackService, useValue: snackSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SharedListsComponent);
        component = fixture.componentInstance;
    });

    it('debería crear el componente', () => {
        sharedListServiceSpy.getSharedLists.and.returnValue(of({ data: [] }));
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('debería cargar listas compartidas correctamente', () => {
        const fakeData = [{ id: 1, name: 'Lista 1', products: [] }];
        sharedListServiceSpy.getSharedLists.and.returnValue(of({ data: fakeData }));

        fixture.detectChanges();

        expect(component.lists.length).toBe(1);
        expect(component.pagedLists.length).toBeGreaterThan(0);
        expect(component.isLoading).toBeFalse();
    });

    it('debería mostrar error si falla la carga de listas', () => {
        sharedListServiceSpy.getSharedLists.and.returnValue(throwError(() => new Error('Error')));
        fixture.detectChanges();

        expect(component.errorMessage).toBe('No se pudieron cargar las listas compartidas.');
        expect(component.isLoading).toBeFalse();
    });

    it('debería actualizar el estado de comprado de un producto', () => {
        const product = { id: 1, name: 'Producto 1', quantity: 2, purchased: false };
        listServiceSpy.updateProduct.and.returnValue(of({ data: { ...product, purchased: true } }));

        component.togglePurchased(product);

        expect(listServiceSpy.updateProduct).toHaveBeenCalledWith(1, { purchased: true });
        expect(snackSpy.show).toHaveBeenCalledWith('Producto marcado como comprado');
    });


    it('debería mostrar error si falla al actualizar producto', () => {
        const product = { id: 1, name: 'Producto 1', quantity: 2, purchased: false };
        listServiceSpy.updateProduct.and.returnValue(throwError(() => new Error('Error')));

        component.togglePurchased(product);

        expect(snackSpy.show).toHaveBeenCalledWith('Error al actualizar el producto');
    });
});
