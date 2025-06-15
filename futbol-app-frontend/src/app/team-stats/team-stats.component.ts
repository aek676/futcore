import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../services/api.service';
import { TeamStats } from '../models/team-stats.interface';

@Component({
  selector: 'app-team-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit {
  teamStats?: TeamStats;
  loading = true;
  error = '';
  retrying = false;

  // Mapeo de equipos a sus respectivas ligas
  private teamLeagueMap: { [key: number]: { leagueId: number, season: number } } = {
    // La Liga (España)
    541: { leagueId: 140, season: 2023 }, // Real Madrid
    529: { leagueId: 140, season: 2023 }, // Barcelona
    530: { leagueId: 140, season: 2023 }, // Atlético Madrid
    548: { leagueId: 140, season: 2023 }, // Real Sociedad
    538: { leagueId: 140, season: 2023 }, // Athletic Bilbao
    533: { leagueId: 140, season: 2023 }, // Sevilla
    531: { leagueId: 140, season: 2023 }, // Real Betis
    532: { leagueId: 140, season: 2023 }, // Valencia
    
    // Premier League (Inglaterra)
    50: { leagueId: 39, season: 2023 }, // Manchester City
    42: { leagueId: 39, season: 2023 }, // Arsenal
    40: { leagueId: 39, season: 2023 }, // Liverpool
    33: { leagueId: 39, season: 2023 }, // Manchester United
    49: { leagueId: 39, season: 2023 }, // Chelsea
    47: { leagueId: 39, season: 2023 }, // Tottenham
    52: { leagueId: 39, season: 2023 }, // Crystal Palace
    35: { leagueId: 39, season: 2023 }, // Bournemouth
    
    // Bundesliga (Alemania)
    157: { leagueId: 78, season: 2023 }, // Bayern Munich
    165: { leagueId: 78, season: 2023 }, // Borussia Dortmund
    173: { leagueId: 78, season: 2023 }, // RB Leipzig
    168: { leagueId: 78, season: 2023 }, // Bayer Leverkusen
    169: { leagueId: 78, season: 2023 }, // Eintracht Frankfurt
    167: { leagueId: 78, season: 2023 }, // VfL Wolfsburg
    159: { leagueId: 78, season: 2023 }, // Hertha Berlin
    161: { leagueId: 78, season: 2023 }, // VfB Stuttgart
    
    // Ligue 1 (Francia)
    85: { leagueId: 61, season: 2023 }, // Paris Saint Germain
    91: { leagueId: 61, season: 2023 }, // Olympique Marseille
    80: { leagueId: 61, season: 2023 }, // Olympique Lyonnais
    93: { leagueId: 61, season: 2023 }, // AS Monaco
    81: { leagueId: 61, season: 2023 }, // Lille
    94: { leagueId: 61, season: 2023 }, // Stade Rennais
    82: { leagueId: 61, season: 2023 }, // Montpellier
    84: { leagueId: 61, season: 2023 }, // Nice
    
    // Serie A (Italia)
    496: { leagueId: 135, season: 2023 }, // Juventus
    489: { leagueId: 135, season: 2023 }, // AC Milan
    505: { leagueId: 135, season: 2023 }, // Inter
    487: { leagueId: 135, season: 2023 }, // AS Roma
    492: { leagueId: 135, season: 2023 }, // Napoli
    488: { leagueId: 135, season: 2023 }, // Lazio
    500: { leagueId: 135, season: 2023 }, // Atalanta
    502: { leagueId: 135, season: 2023 }  // Fiorentina
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadTeamStats();
  }  loadTeamStats() {
    const teamId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (teamId) {
      this.loading = true;
      this.error = '';
      
      // Buscar la liga correcta en el mapeo
      const teamLeague = this.teamLeagueMap[teamId];
      
      if (teamLeague) {
        console.log(`Loading stats for team ${teamId} in league ${teamLeague.leagueId} season ${teamLeague.season}`);
        
        this.apiService.getTeamStatistics(teamId, teamLeague.leagueId, teamLeague.season).subscribe({
          next: (response) => {
            console.log('Stats received:', response);
            this.teamStats = response;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching team stats:', error);
            this.error = error;
            this.loading = false;
            this.retrying = false;
          }
        });
      } else {
        console.warn(`No league mapping found for team ${teamId}`);
        this.error = `No se encontraron estadísticas para este equipo. El equipo no está en nuestras ligas soportadas.`;
        this.loading = false;
      }
    } else {
      this.error = 'ID de equipo no válido';
      this.loading = false;
    }
  }

  retry() {
    if (!this.retrying) {
      this.retrying = true;
      this.loadTeamStats();
    }
  }

  goBack() {
    this.router.navigate(['/teams']);
  }

  getFormClasses(result: string): string[] {
    const classes = ['form-indicator'];
    switch (result) {
      case 'W':
        classes.push('win');
        break;
      case 'L':
        classes.push('loss');
        break;
      case 'D':
        classes.push('draw');
        break;
    }
    return classes;
  }

  getResultText(result: string): string {
    switch (result) {
      case 'W':
        return 'Victoria';
      case 'L':
        return 'Derrota';
      case 'D':
        return 'Empate';
      default:
        return '';
    }
  }
}
