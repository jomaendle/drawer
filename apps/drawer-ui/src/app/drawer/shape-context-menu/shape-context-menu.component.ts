import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-shape-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shape-context-menu.component.html',
  styleUrl: './shape-context-menu.component.css',
  host: { class: 'block bg-gray-100 p-2 rounded-lg shadow-lg' },
})
export class ShapeContextMenuComponent {}
