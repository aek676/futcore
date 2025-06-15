import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="matches-container">
      <h1>Partidos</h1>
      <p>Próximamente: Lista de partidos</p>
    </div>
  `,
  styles: [`
    .matches-container {
      padding: 20px;
    }
    h1 {
      color: var(--primary-color);
      margin-bottom: 20px;
    }
  `]
})
export class MatchesComponent {}
