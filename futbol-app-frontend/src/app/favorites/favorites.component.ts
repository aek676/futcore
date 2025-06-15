import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditNoteDialogComponent } from '../components/edit-note-dialog/edit-note-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FavoritesService } from '../services/favorites.service';
import { Team } from '../models/team.interface';
import { TeamUpdate } from '../models/team-update.interface';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `    <div class="favorites-container">
      <h1>Mis Equipos Favoritos</h1>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="error" class="error-container">
        <mat-icon>error</mat-icon>
        <p>{{ error }}</p>
        <button mat-button color="primary" (click)="loadFavorites()">
          Reintentar
        </button>
      </div>

      <div *ngIf="!loading && !error && favoriteTeams.length === 0" class="no-favorites">
        <mat-icon>sports_soccer</mat-icon>
        <p>No tienes equipos favoritos aún.</p>
        <button mat-button color="primary" routerLink="/teams">
          Ver equipos disponibles
        </button>
      </div>

      <div class="teams-grid" *ngIf="favoriteTeams.length > 0">
        <mat-card class="team-card" *ngFor="let team of favoriteTeams">
          <img mat-card-image [src]="team.logo" [alt]="team.name" class="team-logo">
          <mat-card-header>
            <mat-card-title>{{ team.name }}</mat-card-title>
            <mat-card-subtitle>{{ team.country }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Fundado:</strong> {{ team.founded }}</p>
            <p><strong>Estadio:</strong> {{ team.venue_name }}</p>
            <p *ngIf="team.personalNote" class="personal-note">
              <strong>Nota:</strong> {{ team.personalNote }}
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" [routerLink]="['/teams', team.id, 'stats']">
              <mat-icon>bar_chart</mat-icon>
              Estadísticas
            </button>
            <button mat-button color="accent" (click)="editNote(team)">
              <mat-icon>edit</mat-icon>
              Editar Nota
            </button>
            <button mat-button color="warn" (click)="removeFromFavorites(team)">
              <mat-icon>favorite</mat-icon>
              Eliminar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .favorites-container {
      padding: 24px;
    }

    h1 {
      color: var(--primary-color);
      margin-bottom: 24px;
      font-size: 2rem;
    }    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }

    .error-container {
      text-align: center;
      padding: 48px;
      background: #ffebee;
      border-radius: 8px;
      margin: 24px 0;
      color: #d32f2f;
    }

    .error-container mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    .no-favorites {
      text-align: center;
      padding: 48px;
      background: #f5f5f5;
      border-radius: 8px;
      margin: 24px 0;
    }

    .no-favorites mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
      color: #666;
    }

    .no-favorites p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 16px;
    }

    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      padding: 20px;
    }

    .team-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .team-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .team-logo {
      height: 200px;
      object-fit: contain;
      padding: 16px;
      background: #f5f5f5;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-around;
      padding: 8px 16px 16px;
    }

    .personal-note {
      margin-top: 8px;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
      font-style: italic;
    }

    @media (max-width: 599px) {
      .favorites-container {
        padding: 16px;
      }

      .teams-grid {
        grid-template-columns: 1fr;
        padding: 10px;
      }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favoriteTeams: Team[] = [];
  loading = true;
  error = '';

  constructor(
    private favoritesService: FavoritesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.error = '';
    this.favoritesService.getFavorites().subscribe({
      next: (teams) => {
        this.favoriteTeams = teams;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los equipos favoritos';
        this.loading = false;
        console.error('Error loading favorites:', error);
      }
    });
  }

  removeFromFavorites(team: Team) {
    this.favoritesService.removeFromFavorites(team.id).subscribe({
      next: () => {
        this.snackBar.open(`${team.name} eliminado de favoritos`, 'Cerrar', {
          duration: 3000
        });
        this.loadFavorites();
      },
      error: (error) => {
        this.snackBar.open('Error al eliminar de favoritos', 'Cerrar', {
          duration: 3000
        });
        console.error('Error removing from favorites:', error);
      }
    });
  }
  editNote(team: Team) {
    const dialogRef = this.dialog.open(EditNoteDialogComponent, {
      width: '400px',
      data: {
        name: team.name,
        venueName: team.venue_name,
        note: team.personalNote || ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updates: TeamUpdate = {
          name: result.name !== team.name ? result.name : undefined,
          venueName: result.venueName !== team.venue_name ? result.venueName : undefined,
          personalNote: result.note !== team.personalNote ? result.note : undefined
        };

        // Solo actualizar si hay cambios
        if (Object.values(updates).some(value => value !== undefined)) {
          this.favoritesService.updateTeam(team.id, updates).subscribe({
            next: () => {
              this.snackBar.open('Equipo actualizado', 'Cerrar', {
                duration: 3000
              });
              this.loadFavorites();
            },
            error: (error) => {
              this.snackBar.open('Error al actualizar el equipo', 'Cerrar', {
                duration: 3000
              });
              console.error('Error updating team:', error);
            }
          });
        }
      }
    });
  }
}
