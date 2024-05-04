import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'launch', //first page launched
    pathMatch: 'full',
  },
  {
    path: 'watchlist',
    loadComponent: () => import('./watchlist/watchlist.page').then( m => m.WatchlistPage)
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./details/details.page').then( m => m.DetailsPage)
  },
  {
    path: 'launch',
    loadComponent: () => import('./launch/launch.page').then( m => m.LaunchPage)
  },
];
