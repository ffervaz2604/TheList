import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SharedListService } from '../service/service.service';

@Component({
  selector: 'app-shared-lists',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './shared-lists.component.html',
  styleUrls: ['./shared-lists.component.scss']
})
export class SharedListsComponent implements OnInit {
  lists: any[] = [];
  expanded: boolean[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private sharedListService: SharedListService) { }

  ngOnInit(): void {
    this.sharedListService.getSharedLists().subscribe({
      next: (data) => {
        this.lists = data;
        this.expanded = new Array(data.length).fill(false);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las listas compartidas.';
        this.isLoading = false;
      }
    });
  }

  toggle(index: number): void {
    this.expanded[index] = !this.expanded[index];
  }
}
