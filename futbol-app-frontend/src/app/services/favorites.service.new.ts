import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Team } from '../models/team.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/favorites';
  private favoritesSubject = new BehaviorSubject<Team[]>([]);

  constructor(private http: HttpClient) {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.http.get<Team[]>(this.apiUrl).subscribe({
      next: (teams) => this.favoritesSubject.next(teams),
      error: (error) => console.error('Error loading favorites:', error)
    });
  }

  getFavorites(): Observable<Team[]> {
    return this.favoritesSubject.asObservable();
  }

  addToFavorites(team: Team): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team).pipe(
      tap(() => {
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next([...currentFavorites, team]);
      })
    );
  }

  removeFromFavorites(teamId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${teamId}`).pipe(
      tap(() => {
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next(
          currentFavorites.filter(team => team.id !== teamId)
        );
      })
    );
  }

  isFavorite(teamId: number): boolean {
    return this.favoritesSubject.value.some(team => team.id === teamId);
  }

  toggleFavorite(team: Team): void {
    if (this.isFavorite(team.id)) {
      this.removeFromFavorites(team.id).subscribe({
        error: (error) => console.error('Error removing favorite:', error)
      });
    } else {
      this.addToFavorites(team).subscribe({
        error: (error) => console.error('Error adding favorite:', error)
      });
    }
  }
}
