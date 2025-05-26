import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<any[]>('http://localhost:8000/api/shared-lists', { headers }).subscribe({
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
