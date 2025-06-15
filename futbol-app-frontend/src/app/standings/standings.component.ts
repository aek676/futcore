import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';

interface League {
  id: number;
  name: string;
  country: string;
  flag: string;
  season: number;
}

interface StandingTeam {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
}

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
  standings: StandingTeam[] = [];
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

  displayedColumns: string[] = ['position', 'team', 'played', 'won', 'drawn', 'lost', 'goalsFor', 'goalsAgainst', 'goalDiff', 'points'];

  constructor(private apiService: ApiService) {
    this.selectedLeague = this.leagues[0]; // La Liga por defecto
  }

  ngOnInit() {
    this.loadStandings();
  }

  loadStandings() {
    this.loading = true;
    this.standings = [];
    
    this.apiService.getStandings(this.selectedLeague.id, this.selectedLeague.season).subscribe({
      next: (standings) => {
        console.log('Standings received:', standings);
        this.standings = standings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching standings:', error);
        // Usar datos de ejemplo en caso de error
        this.standings = this.getExampleStandings(this.selectedLeague.id);
        this.loading = false;
      }
    });
  }

  onLeagueChange() {
    this.loadStandings();
  }

  getPositionClass(position: number): string {
    if (position <= 4) {
      return 'champions-league';
    } else if (position <= 6) {
      return 'europa-league';
    } else if (position >= 18) {
      return 'relegation';
    }
    return 'mid-table';
  }

  getGoalDiffClass(goalDiff: number): string {
    if (goalDiff > 0) {
      return 'positive';
    } else if (goalDiff < 0) {
      return 'negative';
    }
    return 'neutral';
  }

  private getExampleStandings(leagueId: number): StandingTeam[] {
    const standingsData: { [key: number]: StandingTeam[] } = {
      // La Liga
      140: [
        {
          rank: 1,
          team: { id: 541, name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
          points: 68,
          goalsDiff: 35,
          group: 'Primera División',
          form: 'WWWLW',
          status: 'same',
          description: 'Champions League',
          all: { played: 25, win: 21, draw: 5, lose: 1, goals: { for: 58, against: 23 } }
        },
        {
          rank: 2,
          team: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
          points: 62,
          goalsDiff: 28,
          group: 'Primera División',
          form: 'WWDWL',
          status: 'same',
          description: 'Champions League',
          all: { played: 25, win: 19, draw: 5, lose: 3, goals: { for: 52, against: 24 } }
        },
        {
          rank: 3,
          team: { id: 530, name: 'Atlético Madrid', logo: 'https://media.api-sports.io/football/teams/530.png' },
          points: 58,
          goalsDiff: 18,
          group: 'Primera División',
          form: 'WWDLD',
          status: 'same',
          description: 'Champions League',
          all: { played: 25, win: 17, draw: 7, lose: 3, goals: { for: 45, against: 27 } }
        }
      ],
      // Premier League
      39: [
        {
          rank: 1,
          team: { id: 50, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
          points: 71,
          goalsDiff: 42,
          group: 'Premier League',
          form: 'WWWWW',
          status: 'same',
          description: 'Champions League',
          all: { played: 25, win: 22, draw: 5, lose: 0, goals: { for: 64, against: 22 } }
        },
        {
          rank: 2,
          team: { id: 42, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
          points: 65,
          goalsDiff: 32,
          group: 'Premier League',
          form: 'WWLWW',
          status: 'same',
          description: 'Champions League',
          all: { played: 25, win: 20, draw: 5, lose: 2, goals: { for: 56, against: 24 } }
        },
        {
          rank: 3,
          team: { id: 40, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
          points: 61,
          goalsDiff: 28,
          group: 'Premier League',
          form: 'WDWWL',
          status: 'same',
          description: 'Champions League',
          all: { played: 25, win: 18, draw: 7, lose: 2, goals: { for: 51, against: 23 } }
        }
      ]
    };
    
    return standingsData[leagueId] || [];
  }
}
