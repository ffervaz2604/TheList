import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductManagerComponent } from './product-manager.component';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ListService } from '../../services/list.service';
import { SnackService } from '../../services/snack.service';

describe('ProductManagerComponent', () => {
    let component: ProductManagerComponent;
    let fixture: ComponentFixture<ProductManagerComponent>;
    let mockListService: any;
    let mockSnackService: any;
    let mockDialogRef: any;

    beforeEach(async () => {
        mockListService = {
            addProduct: jasmine.createSpy().and.returnValue(of({ data: { id: 1, name: 'Pan', quantity: 2, purchased: false } })),
            updateProduct: jasmine.createSpy().and.returnValue(of({})),
            deleteProduct: jasmine.createSpy().and.returnValue(of({}))
        };

        mockSnackService = {
            show: jasmine.createSpy()
        };

        mockDialogRef = {
            close: jasmine.createSpy()
        };

        await TestBed.configureTestingModule({
            imports: [ProductManagerComponent, ReactiveFormsModule, TranslocoTestingModule],
            providers: [
                FormBuilder,
                { provide: ListService, useValue: mockListService },
                { provide: SnackService, useValue: mockSnackService },
                { provide: MatDialogRef, useValue: mockDialogRef },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        listId: 1,
                        currentProducts: []
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductManagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería agregar un producto', () => {
        component.form.setValue({ name: 'Pan', quantity: 2, purchased: false });
        component.addProduct();
        expect(mockListService.addProduct).toHaveBeenCalledWith(1, { name: 'Pan', quantity: 2, purchased: false });
        expect(component.products.length).toBe(1);
        expect(mockSnackService.show).toHaveBeenCalledWith('Producto agregado', 'Cerrar', { duration: 2000 });
    });

    it('debería alternar el estado de comprado', () => {
        const producto = { id: 1, name: 'Pan', quantity: 1, purchased: false };
        component.products = [producto];
        component.togglePurchased(producto);
        expect(mockListService.updateProduct).toHaveBeenCalledWith(1, { ...producto, purchased: true });
    });

    it('debería eliminar un producto', () => {
        component.products = [{ id: 1, name: 'Pan', quantity: 1, purchased: false }];
        component.deleteProduct(1, 0);
        expect(mockListService.deleteProduct).toHaveBeenCalledWith(1);
        expect(component.products.length).toBe(0);
        expect(mockSnackService.show).toHaveBeenCalledWith('Producto eliminado', 'Cerrar', { duration: 2000 });
    });

    it('debería cerrar el diálogo', () => {
        component.close();
        expect(mockDialogRef.close).toHaveBeenCalledWith(component.products);
    });
});
