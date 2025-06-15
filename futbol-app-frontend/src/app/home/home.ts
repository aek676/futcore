import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../services/api.service';

interface FeaturedMatch {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: string; // Agregar score opcional
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  featuredMatches: FeaturedMatch[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadFeaturedMatches();
  }

  loadFeaturedMatches() {
    this.loading = true;
    this.error = null;
      this.apiService.getLaLigaMatches().subscribe({
      next: (data: any[]) => {
        // Transformar los datos de la API al formato que necesitamos
        this.featuredMatches = data.slice(0, 6).map((match: any) => {
          // Parsear la fecha si viene como string
          let matchDate: Date;
          try {
            matchDate = new Date(match.date);
          } catch {
            matchDate = new Date(); // Fallback a fecha actual
          }
          
          const today = new Date();
          let status: 'upcoming' | 'live' | 'finished' = 'upcoming';
            // Determinar el estado del partido basado en varios factores
          if (match.score && match.score !== 'vs' && match.score.trim() !== '') {
            // Si tiene un score definido, el partido ya terminó
            status = 'finished';
          } else {
            const now = new Date();
            const diffInHours = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            
            if (diffInHours < -2) {
              // Si han pasado más de 2 horas, probablemente terminó
              status = 'finished';
            } else if (diffInHours >= -2 && diffInHours <= 2) {
              // Si está dentro de 2 horas antes o después, podría estar en vivo
              status = 'live';
            } else {
              // Si falta más de 2 horas, está por venir
              status = 'upcoming';
            }
          }
            return {
            homeTeam: match.homeTeam || 'Equipo Local',
            awayTeam: match.awayTeam || 'Equipo Visitante',
            date: this.formatDate(matchDate),
            time: this.formatTime(matchDate),
            competition: match.competition || 'La Liga',
            status: status,
            score: (status === 'finished' && match.score && match.score !== 'vs') ? match.score : undefined
          };
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured matches:', error);
        this.error = 'Error al cargar los partidos destacados';
        this.loading = false;
        
        // Fallback a datos de ejemplo si hay error
        this.loadFallbackMatches();
      }
    });
  }

  private isMatchToday(matchDate: Date): boolean {
    const today = new Date();
    return matchDate.toDateString() === today.toDateString();
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  private loadFallbackMatches() {
    this.featuredMatches = [
      {
        homeTeam: 'Real Madrid',
        awayTeam: 'FC Barcelona',
        date: '15/06/2025',
        time: '20:00',
        competition: 'La Liga',
        status: 'upcoming'
      },
      {
        homeTeam: 'Atlético Madrid',
        awayTeam: 'Valencia CF',
        date: '16/06/2025',
        time: '19:00',
        competition: 'La Liga',
        status: 'upcoming'
      },
      {
        homeTeam: 'Sevilla FC',
        awayTeam: 'Real Betis',
        date: '14/06/2025',
        time: '21:30',
        competition: 'La Liga',
        status: 'finished',
        score: '2-1'
      },
      {
        homeTeam: 'Villarreal',
        awayTeam: 'Athletic Bilbao',
        date: '13/06/2025',
        time: '18:00',
        competition: 'La Liga',
        status: 'finished',
        score: '1-0'
      },
      {
        homeTeam: 'Real Sociedad',
        awayTeam: 'Getafe',
        date: '14/06/2025',
        time: '16:00',
        competition: 'La Liga',
        status: 'live'
      }
    ];
  }
}
