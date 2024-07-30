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
  host: {class: 'block overflow-hidden'},
})
export class LayerComponent  {
  stage = input.required<Konva.Stage>();
  layer = input.required<Konva.Layer>();
  toggle = output<Konva.Layer>();

  shapeService = inject(ShapeService);

 onShapeClick(shape: Konva.Node) {

   const res = this.stage().findOne(`#${shape.attrs.id}`);
   if (res) {
    this.shapeService.selectedShape.set(res as Konva.Shape);
   }
 }
}
