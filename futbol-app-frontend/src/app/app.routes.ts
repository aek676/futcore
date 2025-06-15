import { Routes } from '@angular/router';
import { Home } from './home/home';
import { TeamsComponent } from './teams/teams.component';
import { MatchesComponent } from './matches/matches.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { LaLigaMatchesComponent } from './components/laliga-matches/laliga-matches.component';
import { StandingsComponent } from './standings/standings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'teams', component: TeamsComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'teams/:id/stats', component: TeamStatsComponent },
  { path: 'standings', component: StandingsComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'laliga-matches', component: LaLigaMatchesComponent },
  // Ruta para cualquier otra URL no definida
  { path: '**', redirectTo: '/home' }
];
