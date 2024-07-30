import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideHeroIcons } from './hero-icons';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  viewProviders: [provideHeroIcons()],
})
export class AppComponent {
  title = 'drawer-ui';
}
