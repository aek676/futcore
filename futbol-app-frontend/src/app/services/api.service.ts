import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Team } from '../models/team.interface';
import { TeamStats } from '../models/team-stats.interface';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Eliminamos los headers ya que el backend maneja la autenticación con la API externa
  
  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) {}

  getTeams(league: number, season: number): Observable<Team[]> {
    const cacheKey = `teams_${league}_${season}`;
    const cachedData = this.cacheService.getItem(cacheKey);
    
    if (cachedData) {
      console.log('Using cached teams data');
      return of(cachedData);
    }

    return this.http.get(`${environment.apiUrl}/teams`, {
      params: {
        league: league.toString(),
        season: season.toString()
      }
    }).pipe(
      map((response: any) => {
        console.log('API Response:', response);
        const teams = response.response.map((item: any) => ({
          id: item.team.id,
          name: item.team.name,
          logo: item.team.logo,
          country: item.team.country,
          founded: item.team.founded,
          venue_name: item.venue?.name || 'No venue information'
        }));
        this.cacheService.setItem(cacheKey, teams);
        return teams;
      }),
      catchError(this.handleError)
    );
  }

  getTeamStatistics(teamId: number, league: number, season: number): Observable<TeamStats> {
    const cacheKey = `stats_${teamId}_${league}_${season}`;
    const cachedData = this.cacheService.getItem(cacheKey);
    
    if (cachedData) {
      console.log('Using cached team statistics');
      return of(cachedData);
    }

    return this.http.get(`${environment.apiUrl}/teams/statistics`, {
      params: {
        team: teamId.toString(),
        league: league.toString(),
        season: season.toString()
      }
    }).pipe(
      map((response: any) => {
        console.log('API Response (stats):', response);
        if (!response.response || Object.keys(response.response).length === 0) {
          throw new HttpErrorResponse({
            error: { message: 'No se encontraron estadísticas para este equipo' },
            status: 404,
            statusText: 'Not Found'
          });
        }
        const stats = response.response;
        this.cacheService.setItem(cacheKey, stats);
        return stats;
      }),
      catchError(this.handleError)
    );
  }

  getFixtures(teamId: number, last: number = 5): Observable<any> {
    const cacheKey = `fixtures_${teamId}_${last}`;
    const cachedData = this.cacheService.getItem(cacheKey);
    
    if (cachedData) {
      console.log('Using cached fixtures data');
      return of(cachedData);
    }

    return this.http.get(`${environment.apiUrl}/fixtures`, {
      params: {
        team: teamId.toString(),
        last: last.toString()
      }
    }).pipe(
      map((response: any) => {
        const fixtures = response.response;
        this.cacheService.setItem(cacheKey, fixtures);
        return fixtures;
      }),
      catchError(this.handleError)
    );
  }

  getLaLigaMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/scraper/laliga`).pipe(
      catchError(error => {
        console.error('Error fetching LaLiga matches:', error);
        return throwError(() => error);
      })
    );
  }

  getStandings(league: number, season: number): Observable<any[]> {
    const cacheKey = `standings_${league}_${season}`;
    const cachedData = this.cacheService.getItem(cacheKey);
    
    if (cachedData) {
      console.log('Using cached standings data');
      return of(cachedData);
    }

    return this.http.get(`${environment.apiUrl}/standings`, {
      params: {
        league: league.toString(),
        season: season.toString()
      }
    }).pipe(
      map((response: any) => {
        console.log('Standings API Response:', response);
        const standings = response.response[0]?.league?.standings[0] || [];
        this.cacheService.setItem(cacheKey, standings);
        return standings;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'Ha ocurrido un error en el servidor';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = 'Error: ' + error.error.message;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 429:
          errorMessage = 'Has alcanzado el límite de peticiones a la API';
          break;
        case 403:
          errorMessage = 'Error de autenticación con la API. Verifica tu API key';
          break;
        case 404:
          errorMessage = 'No se encontraron estadísticas para este equipo';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet';
          break;
        default:
          errorMessage = `Error del servidor (${error.status}): ${error.error?.message || 'Ha ocurrido un error desconocido'}`;
      }
    }
    
    console.error('Error message:', errorMessage);
    return throwError(() => errorMessage);
  }
}
