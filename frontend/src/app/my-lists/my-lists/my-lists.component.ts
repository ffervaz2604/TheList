import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListService } from '../../services/list.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ListFormComponent } from '../list-form/list-form.component';
import { ApiResponse } from '../../interfaces/api-response';
import { EditListComponent } from '../edit-list/edit-list.component';

@Component({
  selector: 'app-my-lists',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
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
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listService.getAll().subscribe({
      next: (response: ApiResponse<any[]>) => {
        this.lists = Array.isArray(response.data) ? response.data : [];
        this.expanded = new Array(this.lists.length).fill(false);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar tus listas.';
        this.isLoading = false;
      }
    });
  }

  toggle(index: number): void {
    this.expanded[index] = !this.expanded[index];
  }

  deleteList(id: number): void {
    this.listService.delete(id).subscribe({
      next: () => {
        this.lists = this.lists.filter(list => list.id !== id);
        this.expanded = new Array(this.lists.length).fill(false);
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar la lista.';
      }
    });
  }

  createList(): void {
    const dialogRef = this.dialog.open(ListFormComponent);

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
          next: (response) => {
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


}
