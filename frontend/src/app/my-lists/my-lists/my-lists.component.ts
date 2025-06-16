import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListService } from '../../services/list.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ListFormComponent } from '../list-form/list-form.component';
import { ApiResponse } from '../../interfaces/api-response';
import { EditListComponent } from '../edit-list/edit-list.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { SnackService } from '../../services/snack.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ProductManagerComponent } from '../product-manager/product-manager.component';
import { ShareListComponent } from '../share-list/share-list.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../interfaces/product';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-my-lists',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinner,
    MatCard,
    TranslocoModule,
    MatTooltipModule
  ],
  templateUrl: './my-lists.component.html',
  styleUrls: ['./my-lists.component.scss']
})
export class MyListsComponent implements OnInit {
  lists: any[] = [];
  expanded: boolean[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private listService: ListService,
    private dialog: MatDialog,
    private snack: SnackService,
    private snackBar: SnackService,
    private route: ActivatedRoute,
    private router: Router,
    private transloco: TranslocoService
  ) { }

  ngOnInit(): void {
    this.listService.getAll().subscribe({
      next: (response: ApiResponse<any[]>) => {
        this.lists = Array.isArray(response.data) ? response.data : [];
        this.expanded = new Array(this.lists.length).fill(false);
        this.isLoading = false;

        this.abrirDesdeQuery();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar tus listas.';
        this.isLoading = false;
      }
    });
  }

  abrirDesdeQuery() {
    this.route.queryParams.subscribe(params => {
      const listId = +params['list'];
      const productId = +params['product'];

      if (listId) {
        const index = this.lists.findIndex(l => l.id === listId);
        if (index !== -1) {
          this.openProductManager(this.lists[index], index);
        }
      } else if (productId) {
        const listIndex = this.lists.findIndex(l =>
          l.products?.some((p: Product) => p.id === productId)
        );
        if (listIndex !== -1) {
          const list = this.lists[listIndex];
          this.openProductManager(list, listIndex);
        }
      }

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          list: null,
          product: null,
          t: null
        },
        queryParamsHandling: 'merge'
      });
    });
  }

  toggle(index: number): void {
    this.expanded[index] = !this.expanded[index];
  }

  deleteList(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate('dialog.delete_title'),
        message: this.transloco.translate('dialog.delete_message'),
        confirmText: 'dialog.confirm',
        cancelText: 'dialog.cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.listService.delete(id).subscribe({
          next: () => {
            this.lists = this.lists.filter(list => list.id !== id);
            this.expanded = new Array(this.lists.length).fill(false);
            this.snack.show(this.transloco.translate('messages.list_deleted'));
          },
          error: () => {
            this.snack.show(
              this.transloco.translate('errors.delete_list'),
              this.transloco.translate('actions.close'),
              { panelClass: 'custom-snackbar-error' }
            );
          }
        });
      }
    });
  }

  createList(): void {
    const dialogRef = this.dialog.open(ListFormComponent, {
      width: '400px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listService.create(result).subscribe({
          next: (response: ApiResponse<any>) => {
            const newList = response.data;
            newList.products = newList.products ?? [];
            this.lists = [...this.lists, newList];
            this.expanded.push(false);
          },
          error: () => {
            this.errorMessage = 'Error al crear lista';
          }
        });
      }
    });
  }

  editList(list: any): void {
    const dialogRef = this.dialog.open(EditListComponent, {
      width: '420px',
      maxWidth: '95vw',
      data: {
        id: list.id,
        name: list.name,
        archived: list.archived ?? false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listService.update(result.id, {
          name: result.name,
          archived: result.archived
        }).subscribe({
          next: () => {
            const index = this.lists.findIndex(l => l.id === result.id);
            if (index !== -1) {
              this.lists[index].name = result.name;
              this.lists[index].archived = result.archived;
            }
          },
          error: () => {
            this.errorMessage = 'Error al actualizar la lista';
          }
        });
      }
    });
  }

  openProductManager(list: any, listIndex: number): void {
    const dialogRef = this.dialog.open(ProductManagerComponent, {
      data: {
        listId: list.id,
        currentProducts: list.products
      },
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe((updatedProducts: any[]) => {
      if (updatedProducts) {
        this.lists[listIndex].products = updatedProducts;
        this.snackBar.show('Productos actualizados', 'Cerrar', { duration: 2000 });
      }
    });
  }

  shareList(listId: number): void {
    const dialogRef = this.dialog.open(ShareListComponent, {
      width: '700px',
      height: '400px',
      maxWidth: '95vw',
      data: { listId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.email) {
        this.listService.shareList(listId, result.email).subscribe({
          next: () => {
            this.snackBar.show('Lista compartida correctamente');
          },
          error: () => {
            this.snackBar.show('No se pudo compartir la lista');
          }
        });
      }
    });
  }

  public openListDialog(id: number): void {
    const listIndex = this.lists.findIndex(l => l.id === id);
    if (listIndex !== -1) {
      this.openProductManager(this.lists[listIndex], listIndex);
    }
  }

  public openProductDialog(productId: number): void {
    const listIndex = this.lists.findIndex(l =>
      l.products?.some((p: { id: number }) => p.id === productId)
    );
    if (listIndex !== -1) {
      const list = this.lists[listIndex];
      this.openProductManager(list, listIndex);
    }
  }

}
