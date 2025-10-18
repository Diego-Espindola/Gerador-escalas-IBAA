

import { Routes } from '@angular/router';
import { EscalaLouvorPage } from './pages/escala-louvor/escala-louvor';
import { EscalaMidiaPage } from './pages/escala-midia/escala-midia';
import { HomePage } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage
  },
  {
    path: 'escala-louvor',
    component: EscalaLouvorPage
  },
  {
    path: 'escala-midia',
    component: EscalaMidiaPage
  },
];
