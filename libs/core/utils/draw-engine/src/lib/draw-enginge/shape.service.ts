import { Injectable, signal } from '@angular/core';

export interface Shape {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  color: string;
  layer: number;
  isHovered?: boolean;
  isSelected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ShapeService {
  shapes = signal<Shape[]>([]);

  addShape(shape: Shape): void {
    this.shapes.set([...this.shapes(), shape]);
  }

  updateShapes(shapes: Shape[]): void {
    this.shapes.set(shapes);
  }

  deleteShape(shape: Shape): void {
    this.shapes.set(this.shapes().filter((s) => s !== shape));
  }

  clearShapes(): void {
    this.shapes.set([]);
  }

  selectShape(shape: Shape | null): void {
    if (!shape) {
      return;
    }

    this.shapes.set(
      this.shapes().map((s) => ({
        ...s,
        isSelected: s === shape,
      })),
    );
  }
}
