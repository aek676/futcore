import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface Match {
  homeTeam: string;
  awayTeam: string;
  date: string;
  score: string;
  competition: string;
}

@Component({
  selector: 'app-laliga-matches',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="matches-container">
      <h2>La Liga Matches</h2>
      <div class="matches-grid">
        <div *ngFor="let match of matches" class="match-card">
          <div class="match-date">{{ match.date }}</div>
          <div class="match-teams">
            <span class="team home">{{ match.homeTeam }}</span>
            <span class="score">{{ match.score || 'vs' }}</span>
            <span class="team away">{{ match.awayTeam }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .matches-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      text-align: center;
      margin-bottom: 30px;
    }

    .matches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .match-card {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .match-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .match-date {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 10px;
    }

    .match-teams {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .team {
      flex: 1;
      font-weight: 500;
    }

    .home {
      text-align: right;
    }

    .away {
      text-align: left;
    }

    .score {
      font-weight: bold;
      padding: 0 10px;
      color: #2196f3;
    }
  `]
})
export class LaLigaMatchesComponent implements OnInit {
  matches: Match[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadMatches();
  }

  loadMatches() {
    this.apiService.getLaLigaMatches().subscribe({
      next: (data) => {
        this.matches = data;
      },
      error: (error) => {
        console.error('Error loading matches:', error);
      }
    });
  }
}
