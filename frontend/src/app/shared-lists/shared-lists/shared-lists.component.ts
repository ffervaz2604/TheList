import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SharedListService } from '../../services/shared.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-shared-lists',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,MatCard
  ],
  templateUrl: './shared-lists.component.html',
  styleUrls: ['./shared-lists.component.scss']
})
export class SharedListsComponent implements OnInit {
  lists: any[] = [];          // todas las listas del servidor
  pagedLists: any[] = [];     // solo las visibles en la página actual
  expanded: boolean[] = [];

  isLoading = true;
  errorMessage: string | null = null;

  // paginación
  pageSize = 5;
  pageIndex = 0;

  constructor(private sharedListService: SharedListService) { }

  ngOnInit(): void {
    this.sharedListService.getSharedLists().subscribe({
      next: (data) => {
        this.lists = data;
        this.expanded = new Array(data.length).fill(false);
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
}
