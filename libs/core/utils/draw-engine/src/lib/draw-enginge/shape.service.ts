import { effect, Injectable, signal } from '@angular/core';
import Konva from 'konva';
import { Node } from 'konva/lib/Node';

@Injectable({
  providedIn: 'root',
})
export class ShapeService {
  static triangleStaticCount = 0;
  static circleStaticCount = 0;
  static rectangularStaticCount = 0;
  static layerStaticCount = 0;

  #transformer = signal<Konva.Transformer | null>(null);

  selectedShape = signal<Konva.Node | null>(null);

  layers = signal<Konva.Layer[]>([
    new Konva.Layer({
      name: `Layer ${ShapeService.layerStaticCount++}`,
    }),
  ]);

  constructor() {
    const rect = new Konva.Rect();
    // log all properties of the Konva.Rect object
    console.log(Object.keys(rect.attrs));

    effect(() => {
      const shape = this.selectedShape();
      const allShapes = this.layers().flatMap((layer) => layer.getChildren());

      allShapes.forEach((s) => {
        if (!(s instanceof Konva.Group)) {
          if (shape && s.id() === shape.id()) {
            s.stroke('dodgerblue');
            s.strokeWidth(4);

            s.dash([10, 5]);
          } else {
            s.stroke('none');
            s.strokeWidth(0);
          }
        }
      });
    });
  }

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

    rect.on('click', () => {
      this.selectedShape.set(rect);
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

    circle.on('click', () => {
      this.selectedShape.set(circle);
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
      id: `triangle-${ShapeService.triangleStaticCount++}`,
    });

    triangle.on('click', () => {
      this.selectedShape.set(triangle);
    });

    this.#addShape(stage, layer, triangle);
  }

  addLineShape(stage: Konva.Stage, layer: Konva.Layer): void {
    const line = new Konva.Line({
      points: [73, 70, 340, 23, 450, 60, 500, 20],
      stroke: 'black',
      tension: 1,
      draggable: true,
      id: `line-${ShapeService.triangleStaticCount++}`,
    });

    line.on('click', () => {
      this.selectedShape.set(line);
    });

    this.#addShape(stage, layer, line);
  }

  addTextShape(stage: Konva.Stage, layer: Konva.Layer): void {
    const text = new Konva.Text({
      x: 10,
      y: 10,
      text: 'Text',
      fontSize: 20,
      fontFamily: 'Calibri',
      fill: 'black',
      draggable: true,
      id: `text-${ShapeService.triangleStaticCount++}`,
    });

    text.on('click', () => {
      this.selectedShape.set(text);
    });

    this.#addShape(stage, layer, text);
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

  addLayer(stage: Konva.Stage) {
    const layer = new Konva.Layer({
      name: `Layer ${ShapeService.layerStaticCount++}`,
    });
    stage.add(layer);
    stage.draw();

    this.layers.set([...stage.getChildren()]);

    return layer;
  }

  clearCanvas(stage: Konva.Stage): void {
    stage.destroyChildren();
    stage.draw();

    this.layers.set([...stage.getChildren()]);
  }

  setSelectedShape(shape: Konva.Shape | null): void {
    this.selectedShape.set(shape);
  }

  addTransformer(
    stage: Konva.Stage,
    layer: Konva.Layer,
    shapes: Konva.Node[],
  ): void {
    const transformer = new Konva.Transformer();
    layer.add(transformer);

    transformer.nodes(shapes);
    this.#transformer.set(transformer);

    this.layers.set([...stage.getChildren()]);
  }

  stopTransformer(stage: Konva.Stage): void {
    const transformer = this.#transformer();

    if (transformer) {
      transformer.destroy();
    }

    this.layers.set([...stage.getChildren()]);
  }

  copyShape(
    stage: Konva.Stage,
    layer: Konva.Layer | null | undefined,
    shape: Konva.Node,
  ): void {
    const newShape = shape.clone({
      x: shape.x() + 10,
      y: shape.y() + 10,
    });

    newShape.id(`${newShape.id()}-copy`);

    newShape.on('click', () => {
      this.selectedShape.set(newShape);
    });

    this.#addShape(stage, layer || this.addLayer(stage), newShape);
  }

  updateShape(shape: Konva.Node, stage: Konva.Stage) {
    const item = stage.findOne((l: any) => l.attrs.id === shape.attrs.id);

    if (!item) {
      return;
    }

    item.setAttrs(shape.attrs);

    console.log('item', item.attrs, shape.attrs);
  }
}
