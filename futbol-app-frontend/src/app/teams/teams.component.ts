import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../services/api.service';
import { FavoritesService } from '../services/favorites.service';
import { Team } from '../models/team.interface';

interface League {
  id: number;
  name: string;
  country: string;
  flag: string;
  season: number;
}

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  loading = false;
  selectedLeague: League;
  leagues: League[] = [
    {
      id: 140,
      name: 'La Liga',
      country: 'España',
      flag: 'ES',
      season: 2023
    },
    {
      id: 39,
      name: 'Premier League',
      country: 'Inglaterra',
      flag: 'GB',
      season: 2023
    },
    {
      id: 78,
      name: 'Bundesliga',
      country: 'Alemania',
      flag: 'DE',
      season: 2023
    },
    {
      id: 61,
      name: 'Ligue 1',
      country: 'Francia',
      flag: 'FR',
      season: 2023
    },
    {
      id: 135,
      name: 'Serie A',
      country: 'Italia',
      flag: 'IT',
      season: 2023
    }
  ];

  constructor(
    private apiService: ApiService,
    private favoritesService: FavoritesService
  ) {
    // La Liga como liga por defecto
    this.selectedLeague = this.leagues[0];
  }
  ngOnInit() {
    this.loadTeams();
  }  loadTeams() {
    this.loading = true;
    this.teams = [];
    
    console.log('Loading teams for league:', this.selectedLeague);
    
    this.apiService.getTeams(this.selectedLeague.id, this.selectedLeague.season).subscribe({
      next: (teams) => {
        console.log('Teams received from API:', teams);
        this.teams = teams;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching teams from API:', error);
        // En caso de error, usar datos de ejemplo
        console.log('Using example teams for league ID:', this.selectedLeague.id);
        this.teams = this.getExampleTeams(this.selectedLeague.id);
        console.log('Example teams loaded:', this.teams);
        this.loading = false;
      }
    });
  }

  private loadTeamsFromApi() {
    this.apiService.getTeams(this.selectedLeague.id, this.selectedLeague.season).subscribe({
      next: (teams) => {
        console.log('Teams received from API:', teams);
        if (teams && teams.length > 0) {
          this.teams = teams;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching teams from API:', error);
        // Usar datos de ejemplo en caso de error
        const fallbackTeams = this.getExampleTeams(this.selectedLeague.id);
        this.teams = fallbackTeams;
        this.loading = false;
      }
    });
  }

  private loadRealTeamsInBackground() {
    // Intentar cargar datos reales sin bloquear la UI
    this.apiService.getTeams(this.selectedLeague.id, this.selectedLeague.season).subscribe({
      next: (teams) => {
        console.log('Real teams received from API:', teams);
        if (teams && teams.length > 0) {
          // Solo reemplazar si tenemos datos reales válidos
          this.teams = teams;
        }
      },
      error: (error) => {
        console.log('API not available, keeping example data:', error);
        // No hacer nada, mantener los datos de ejemplo
      }
    });
  }
  private getExampleTeams(leagueId: number): Team[] {
    const teamsData: { [key: number]: Team[] } = {
      // La Liga (España)
      140: [
        { id: 541, name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png', country: 'Spain', founded: 1902, venue_name: 'Santiago Bernabéu' },
        { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', country: 'Spain', founded: 1899, venue_name: 'Camp Nou' },
        { id: 530, name: 'Atlético Madrid', logo: 'https://media.api-sports.io/football/teams/530.png', country: 'Spain', founded: 1903, venue_name: 'Wanda Metropolitano' },
        { id: 548, name: 'Real Sociedad', logo: 'https://media.api-sports.io/football/teams/548.png', country: 'Spain', founded: 1909, venue_name: 'Reale Seguros Stadium' },
        { id: 538, name: 'Athletic Bilbao', logo: 'https://media.api-sports.io/football/teams/538.png', country: 'Spain', founded: 1898, venue_name: 'San Mamés' },
        { id: 533, name: 'Sevilla', logo: 'https://media.api-sports.io/football/teams/533.png', country: 'Spain', founded: 1890, venue_name: 'Estadio Ramón Sánchez Pizjuán' },
        { id: 531, name: 'Real Betis', logo: 'https://media.api-sports.io/football/teams/531.png', country: 'Spain', founded: 1907, venue_name: 'Estadio Benito Villamarín' },
        { id: 532, name: 'Valencia', logo: 'https://media.api-sports.io/football/teams/532.png', country: 'Spain', founded: 1919, venue_name: 'Estadio de Mestalla' }
      ],
      // Premier League (Inglaterra)
      39: [
        { id: 50, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png', country: 'England', founded: 1880, venue_name: 'Etihad Stadium' },
        { id: 42, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png', country: 'England', founded: 1886, venue_name: 'Emirates Stadium' },
        { id: 40, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png', country: 'England', founded: 1892, venue_name: 'Anfield' },
        { id: 33, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png', country: 'England', founded: 1878, venue_name: 'Old Trafford' },
        { id: 49, name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png', country: 'England', founded: 1905, venue_name: 'Stamford Bridge' },
        { id: 47, name: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/47.png', country: 'England', founded: 1882, venue_name: 'Tottenham Hotspur Stadium' },
        { id: 52, name: 'Crystal Palace', logo: 'https://media.api-sports.io/football/teams/52.png', country: 'England', founded: 1905, venue_name: 'Selhurst Park' },
        { id: 35, name: 'Bournemouth', logo: 'https://media.api-sports.io/football/teams/35.png', country: 'England', founded: 1899, venue_name: 'Vitality Stadium' }
      ],
      // Bundesliga (Alemania)
      78: [
        { id: 157, name: 'Bayern Munich', logo: 'https://media.api-sports.io/football/teams/157.png', country: 'Germany', founded: 1900, venue_name: 'Allianz Arena' },
        { id: 165, name: 'Borussia Dortmund', logo: 'https://media.api-sports.io/football/teams/165.png', country: 'Germany', founded: 1909, venue_name: 'Signal Iduna Park' },
        { id: 173, name: 'RB Leipzig', logo: 'https://media.api-sports.io/football/teams/173.png', country: 'Germany', founded: 2009, venue_name: 'Red Bull Arena' },
        { id: 168, name: 'Bayer Leverkusen', logo: 'https://media.api-sports.io/football/teams/168.png', country: 'Germany', founded: 1904, venue_name: 'BayArena' },
        { id: 169, name: 'Eintracht Frankfurt', logo: 'https://media.api-sports.io/football/teams/169.png', country: 'Germany', founded: 1899, venue_name: 'Deutsche Bank Park' },
        { id: 167, name: 'VfL Wolfsburg', logo: 'https://media.api-sports.io/football/teams/167.png', country: 'Germany', founded: 1945, venue_name: 'Volkswagen Arena' },
        { id: 159, name: 'Hertha Berlin', logo: 'https://media.api-sports.io/football/teams/159.png', country: 'Germany', founded: 1892, venue_name: 'Olympiastadion Berlin' },
        { id: 161, name: 'VfB Stuttgart', logo: 'https://media.api-sports.io/football/teams/161.png', country: 'Germany', founded: 1893, venue_name: 'Mercedes-Benz Arena' }
      ],
      // Ligue 1 (Francia)
      61: [
        { id: 85, name: 'Paris Saint Germain', logo: 'https://media.api-sports.io/football/teams/85.png', country: 'France', founded: 1970, venue_name: 'Parc des Princes' },
        { id: 91, name: 'Olympique Marseille', logo: 'https://media.api-sports.io/football/teams/91.png', country: 'France', founded: 1899, venue_name: 'Stade Vélodrome' },
        { id: 80, name: 'Olympique Lyonnais', logo: 'https://media.api-sports.io/football/teams/80.png', country: 'France', founded: 1950, venue_name: 'Groupama Stadium' },
        { id: 93, name: 'AS Monaco', logo: 'https://media.api-sports.io/football/teams/93.png', country: 'France', founded: 1924, venue_name: 'Stade Louis II' },
        { id: 81, name: 'Lille', logo: 'https://media.api-sports.io/football/teams/81.png', country: 'France', founded: 1944, venue_name: 'Stade Pierre-Mauroy' },
        { id: 94, name: 'Stade Rennais', logo: 'https://media.api-sports.io/football/teams/94.png', country: 'France', founded: 1901, venue_name: 'Roazhon Park' },
        { id: 82, name: 'Montpellier', logo: 'https://media.api-sports.io/football/teams/82.png', country: 'France', founded: 1974, venue_name: 'Stade de la Mosson' },
        { id: 84, name: 'Nice', logo: 'https://media.api-sports.io/football/teams/84.png', country: 'France', founded: 1904, venue_name: 'Allianz Riviera' }
      ],
      // Serie A (Italia)
      135: [
        { id: 496, name: 'Juventus', logo: 'https://media.api-sports.io/football/teams/496.png', country: 'Italy', founded: 1897, venue_name: 'Allianz Stadium' },
        { id: 489, name: 'AC Milan', logo: 'https://media.api-sports.io/football/teams/489.png', country: 'Italy', founded: 1899, venue_name: 'San Siro' },
        { id: 505, name: 'Inter', logo: 'https://media.api-sports.io/football/teams/505.png', country: 'Italy', founded: 1908, venue_name: 'San Siro' },
        { id: 487, name: 'AS Roma', logo: 'https://media.api-sports.io/football/teams/487.png', country: 'Italy', founded: 1927, venue_name: 'Stadio Olimpico' },
        { id: 492, name: 'Napoli', logo: 'https://media.api-sports.io/football/teams/492.png', country: 'Italy', founded: 1926, venue_name: 'Stadio Diego Armando Maradona' },
        { id: 488, name: 'Lazio', logo: 'https://media.api-sports.io/football/teams/488.png', country: 'Italy', founded: 1900, venue_name: 'Stadio Olimpico' },
        { id: 500, name: 'Atalanta', logo: 'https://media.api-sports.io/football/teams/500.png', country: 'Italy', founded: 1907, venue_name: 'Gewiss Stadium' },
        { id: 502, name: 'Fiorentina', logo: 'https://media.api-sports.io/football/teams/502.png', country: 'Italy', founded: 1926, venue_name: 'Stadio Artemio Franchi' }
      ]
    };
    
    return teamsData[leagueId] || [];
  }

  onLeagueChange() {
    this.loadTeams();
  }

  toggleFavorite(team: Team): void {
    this.favoritesService.toggleFavorite(team).subscribe({
      error: (error) => console.error('Error toggling favorite:', error)
    });
  }

  isFavorite(teamId: number): boolean {
    return this.favoritesService.isFavorite(teamId);
  }
}
