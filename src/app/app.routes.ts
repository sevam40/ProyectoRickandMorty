import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/episodes/pages/episodes-page/episodes-page').then(m => m.EpisodesPage)
  }
];
