import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./drawer/drawer.component').then((m) => m.DrawerComponent),
  },
];
