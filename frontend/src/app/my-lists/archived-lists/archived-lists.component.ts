import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListService } from '../../services/list.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SnackService } from '../../services/snack.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-archived-lists',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    TranslocoModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './archived-lists.component.html',
  styleUrls: ['./archived-lists.component.scss']
})
export class ArchivedListsComponent implements OnInit {
  archivedLists: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private listService: ListService,
    private snackbar: SnackService,
    private dialog: MatDialog,
    private transloco: TranslocoService,
  ) { }

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
        this.snackbar.show('Lista desarchivada correctamente');
        this.loadArchivedLists();
      },
      error: () => {
        this.snackbar.show('No se pudo desarchivar la lista');
      }
    });

  }

  loadArchivedLists(): void {
    this.isLoading = true;
    this.listService.getArchived().subscribe({
      next: (res) => {
        this.archivedLists = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron recargar las listas.';
        this.isLoading = false;
      }
    });
  }

  duplicateList(list: any): void {
    const newName = `${list.name} (copia)`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate('shared-lists.duplicate.title'),
        message: this.transloco.translate('shared-lists.duplicate.confirm', { name: newName }),
        confirmText: this.transloco.translate('shared-lists.duplicate.confirmButton')
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.listService.create({ name: newName }).pipe(
          switchMap((res) => {
            const newListId = res.data.id;
            const requests = list.products.map((p: any) =>
              this.listService.addProduct(newListId, {
                name: p.name,
                quantity: p.quantity,
                purchased: false
              }).pipe(catchError(() => of(null)))
            );
            return forkJoin(requests);
          })
        ).subscribe({
          next: () => {
            this.snackbar.show(this.transloco.translate('shared-lists.duplicate.success'));
          },
          error: () => {
            this.snackbar.show(this.transloco.translate('shared-lists.duplicate.error'));
          }
        });
      }
    });
  }

}
