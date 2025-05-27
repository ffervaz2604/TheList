import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SharedListService } from '../../services/shared.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ListService } from '../../services/list.service';
import { SnackService } from '../../services/snack.service';

@Component({
  selector: 'app-shared-lists',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './shared-lists.component.html',
  styleUrls: ['./shared-lists.component.scss']
})
export class SharedListsComponent implements OnInit {
  lists: any[] = [];
  pagedLists: any[] = [];
  expanded: boolean[] = [];

  isLoading = true;
  errorMessage: string | null = null;

  pageSize = 5;
  pageIndex = 0;

  constructor(
    private sharedListService: SharedListService,
    private listService: ListService,
    private snackbar: SnackService
  ) { }

  ngOnInit(): void {
    this.sharedListService.getSharedLists().subscribe({
      next: (res) => {
        this.lists = res.data || [];
        this.expanded = new Array(this.lists.length).fill(false);
        this.updatePagedLists();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las listas compartidas.';
        this.isLoading = false;
      }
    });
  }

  updatePagedLists(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedLists = this.lists.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedLists();
  }

  toggle(index: number): void {
    const globalIndex = this.pageIndex * this.pageSize + index;
    this.expanded[globalIndex] = !this.expanded[globalIndex];
  }

  isExpanded(index: number): boolean {
    const globalIndex = this.pageIndex * this.pageSize + index;
    return this.expanded[globalIndex];
  }

  togglePurchased(product: any): void {
    const updated = { purchased: !product.purchased };

    this.listService.updateProduct(product.id, updated).subscribe({
      next: () => {
        product.purchased = updated.purchased;
        this.snackbar.show(
          product.purchased
            ? 'Producto marcado como comprado'
            : 'Producto desmarcado'
        );
      },
      error: () => {
        this.snackbar.show('Error al actualizar el producto');
      }
    });
  }

}
