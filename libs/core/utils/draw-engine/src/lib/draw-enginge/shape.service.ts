import { Injectable, signal } from '@angular/core';
import Konva from 'konva';
import { Node } from 'konva/lib/Node';

@Injectable({
  providedIn: 'root',
})
export class ShapeService {
  layers = signal<Node[]>([]);

  static trinagleStaticCount = 0;
  static circleStaticCount = 0;
  static rectangularStaticCount = 0;

  #addShape(stage: Konva.Stage, layer: Konva.Layer, shape: Konva.Shape): void {
    stage.getChildren;
    layer.add(shape);
    stage.add(layer);
    layer.draw();

    this.layers.set([...stage.getChildren()]);
  }

  addRectangularShape(stage: Konva.Stage, layer: Konva.Layer): void {
    const rect = new Konva.Rect({
      x: 20,
      y: 20,
      width: 100,
      height: 100,
      fill: 'red',
      draggable: true,
      id: `rect-${ShapeService.rectangularStaticCount++}`,
    });

    this.#addShape(stage, layer, rect);
  }

  addCircleShape(stage: Konva.Stage, layer: Konva.Layer): void {
    const circle = new Konva.Circle({
      x: 100,
      y: 100,
      radius: 50,
      fill: 'green',
      draggable: true,
      id: `circle-${ShapeService.circleStaticCount++}`,
    });

    this.#addShape(stage, layer, circle);
  }

  addTriangleShape(stage: Konva.Stage, layer: Konva.Layer): void {
    const triangle = new Konva.RegularPolygon({
      x: 200,
      y: 200,
      sides: 3,
      radius: 50,
      fill: 'blue',
      draggable: true,
      id: `triangle-${ShapeService.trinagleStaticCount++}`,
    });

    this.#addShape(stage, layer, triangle);
  }

  deleteShape(stage: Konva.Stage, shape: Node): void {
    shape.destroy();
    stage.draw();

    this.layers.set([...stage.getChildren()]);
  }

  deleteLayer(stage: Konva.Stage, layer: Node): void {
    layer.destroy();
    stage.draw();

    this.layers.set([...stage.getChildren()]);
  }
}
