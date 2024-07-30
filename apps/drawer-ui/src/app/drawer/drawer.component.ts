import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridService, ShapeService } from '@core/draw-engine';
import { NgIcon } from '@ng-icons/core';
import Konva from 'konva';
import { Node } from 'konva/lib/Node';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
})
export class DrawerComponent {
  container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  #shapeService = inject(ShapeService);

  initialLayer = new Konva.Layer();

  stage = computed(() => {
    return new Konva.Stage({
      container: this.container().nativeElement,
      width: 800,
      height: 600,
    });
  });

  layers = this.#shapeService.layers;

  constructor(private gridService: GridService) {
    effect(() => {
      const c = this.#shapeService.layers();
      console.log('this.#shapeService.layerChanged', c);
    });
  }

  addRectangularShape(): void {
    this.#shapeService.addRectangularShape(this.stage(), this.initialLayer);
  }

  addCircleShape(): void {
    this.#shapeService.addCircleShape(this.stage(), this.initialLayer);
  }

  addTriangleShape(): void {
    this.#shapeService.addTriangleShape(this.stage(), this.initialLayer);
  }

  clearCanvas(): void {
    const stage = this.stage();
    stage.destroyChildren();
    stage.draw();
  }

  selectLayer(layer: Node): void {
    const stage = this.stage();
    stage.getChildren().forEach((l) => {
      l.visible(l === layer);
    });
    stage.draw();
  }

  selectShape(shape: Konva.Shape): void {
    const id = shape.attrs.id;
    const shapeFound = this.stage().findOne(`#${id}`);
    console.log('shape', shapeFound);

    shapeFound?.setAttrs({
      stroke: 'red',
      strokeDashArray: [10, 5],
    });
  }

  deleteShape(shape: Konva.Shape): void {
    const id = shape.attrs.id;
    const shapeFound = this.stage().findOne(`#${id}`);

    if (!shapeFound) {
      return;
    }

    this.#shapeService.deleteShape(this.stage(), shapeFound);
  }

  deleteLayer(layer: Node): void {
    this.#shapeService.deleteLayer(this.stage(), layer);
  }
}
