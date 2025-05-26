import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListService } from '../../services/list.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SnackService } from '../../services/snack.service';

@Component({
  selector: 'app-archived-lists',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './archived-lists.component.html',
  styleUrls: ['./archived-lists.component.scss']
})
export class ArchivedListsComponent implements OnInit {
  archivedLists: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private listService: ListService, private snackbar: SnackService) { }

  ngOnInit(): void {
    this.listService.getArchived().subscribe({
      next: (res) => {
        this.archivedLists = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las listas archivadas.';
        this.isLoading = false;
      }
    });
  }

  unarchiveList(id: number): void {
    this.listService.unarchiveList(id).subscribe({
      next: () => {
        this.archivedLists = this.archivedLists.filter(list => list.id !== id);
        this.snackbar.show('Lista desarchivada correctamente');
      },
      error: () => {
        this.snackbar.show('No se pudo desarchivar la lista');
      }
    });
  }

}
