import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchService } from '../../services/search.service';
import { TranslocoModule } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    TranslocoModule,
    MatButtonModule
  ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent {
  @Output() selected = new EventEmitter<{ id: number; type: 'list' | 'product' }>();

  private searchService = inject(SearchService);
  private router = inject(Router);

  searchControl = new FormControl('');
  results: { label: string; id: number; type: 'list' | 'product' }[] = [];

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.results = [])),
        switchMap((value) => this.searchService.globalSearch(value || ''))
      )
      .subscribe({
        next: (res) => {
          this.results = res;
        },
        error: () => { }
      });
  }

  goTo(result: { id: number; type: 'list' | 'product' }) {
    this.selected.emit(result);

    const queryParams =
      result.type === 'product'
        ? { product: result.id }
        : { list: result.id };

    this.router.navigate(['/dashboard/lists'], {
      queryParams: {
        ...queryParams,
        t: Date.now()
      },
      queryParamsHandling: 'merge'
    });

    this.searchControl.setValue('');
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.results = [];
  }

}
