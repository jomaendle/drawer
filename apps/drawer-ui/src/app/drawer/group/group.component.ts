import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import Konva from 'konva';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupComponent {
  group = input.required<Konva.Layer | Konva.Group>();
}
