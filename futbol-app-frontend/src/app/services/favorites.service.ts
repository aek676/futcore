import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Team } from '../models/team.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = environment.backendUrl + '/teams/favorites';
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
      tap((savedTeam) => {
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next([...currentFavorites, savedTeam]);
      })
    );
  }

  removeFromFavorites(teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}`).pipe(
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
  updateTeam(teamId: number, updates: Partial<Team>): Observable<Team> {
    return this.http.patch<Team>(`${this.apiUrl}/${teamId}`, updates);
  }
  toggleFavorite(team: Team): Observable<any> {
    if (this.isFavorite(team.id)) {
      return this.removeFromFavorites(team.id);
    }
    return this.addToFavorites(team);
  }
}