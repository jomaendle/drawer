import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnChanges,
  output,
  Signal,
  SimpleChanges,
} from '@angular/core';
import { ShapeService } from '@core/draw-engine';
import Konva from 'konva';
import { GroupComponent } from '../group/group.component';

@Component({
  selector: 'app-layer',
  standalone: true,
  imports: [CommonModule, GroupComponent],
  templateUrl: './layer.component.html',
  styleUrl: './layer.component.css',
})
export class LayerComponent implements OnChanges {
  layer = input.required<Konva.Layer>();
  toggle = output<Konva.Layer>();

  shapeService = inject(ShapeService);

  groups: Signal<Konva.Group[]> = computed(
    () =>
      this.layer().getChildren(
        (node) => node instanceof Konva.Group || node instanceof Konva.Layer,
      ) as Konva.Group[],
  );

  shapes = computed(
    () =>
      this.layer().getChildren(
        (node) => node instanceof Konva.Shape,
      ) as Konva.Shape[],
  );

  constructor() {
    effect(() => {
      console.log('LayerComponent', this.layer());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('LayerComponent', changes);
  }
}
