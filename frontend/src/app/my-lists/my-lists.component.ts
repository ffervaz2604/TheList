import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListService } from '../services/list.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.listService.getAll().subscribe({
      next: (data) => {
        this.lists = data;
        this.expanded = new Array(data.length).fill(false);
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
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar la lista.';
      }
    });
  }

  createList(): void {
    // aquí puedes usar un modal o prompt simple por ahora
    const name = prompt('Nombre de la nueva lista');
    if (name) {
      this.listService.create({ name }).subscribe({
        next: (newList) => this.lists.push(newList),
        error: () => this.errorMessage = 'Error al crear lista'
      });
    }
  }
}
