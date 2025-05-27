import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ListService } from '../../services/list.service';
import { SnackService } from '../../services/snack.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    TranslocoModule
  ],
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.scss']
})
export class ProductManagerComponent implements OnInit {
  form: FormGroup;
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    private dialogRef: MatDialogRef<ProductManagerComponent>,
    private snackBar: SnackService,
    @Inject(MAT_DIALOG_DATA) public data: { listId: number, currentProducts: any[] }
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      purchased: [false]
    });
  }

  ngOnInit(): void {
    this.products = [...this.data.currentProducts];
  }

  addProduct(): void {
    if (this.form.valid) {
      const product = { ...this.form.value };
      this.listService.addProduct(this.data.listId, product).subscribe({
        next: (res) => {
          this.products.push(res.data);
          this.products = [...this.products];
          this.form.reset({ quantity: 1, purchased: false });
          this.snackBar.show('Producto agregado', 'Cerrar', { duration: 2000 });
        },
        error: () => {
          this.snackBar.show('Error al agregar producto', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  togglePurchased(product: any): void {
    const updated = { ...product, purchased: !product.purchased };
    this.listService.updateProduct(product.id, updated).subscribe({
      next: () => {
        product.purchased = updated.purchased;
        this.snackBar.show(
          product.purchased ? 'Producto marcado como comprado' : 'Producto desmarcado',
          'Cerrar',
          { duration: 2000 }
        );
      },
      error: () => {
        this.snackBar.show('Error al actualizar el producto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteProduct(productId: number, index: number): void {
    this.listService.deleteProduct(productId).subscribe({
      next: () => {
        this.products.splice(index, 1);
        this.products = [...this.products];
        this.snackBar.show('Producto eliminado', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.show('Error al eliminar producto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close(this.products);
  }
}
