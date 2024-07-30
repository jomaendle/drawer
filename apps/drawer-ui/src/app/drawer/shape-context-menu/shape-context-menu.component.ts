import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';

export type ContextAction =
  | 'transform'
  | 'delete'
  | 'copy'
  | 'moveUp'
  | 'moveDown'
  | 'moveToTop'
  | 'moveToBottom';

@Component({
  selector: 'app-shape-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shape-context-menu.component.html',
  styleUrl: './shape-context-menu.component.css',
  host: { class: 'flex flex-col gap-2 bg-gray-100 p-2 rounded-lg shadow-lg' },
})
export class ShapeContextMenuComponent {
  selection = output<ContextAction>();
}
