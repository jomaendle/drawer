import { Injectable } from '@angular/core';
import { GridService } from './grid.service';
import { Shape } from './shape.service';
@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private isMoving = false;
  private selectedShape: Shape | null = null;
  private offsetX = 0;
  private offsetY = 0;

  constructor(private gridService: GridService) {}

  startMoving(
    event: MouseEvent,
    shape: Shape,
    canvas: HTMLCanvasElement,
  ): void {
    this.isMoving = true;
    this.selectedShape = shape;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.offsetX = x - shape.x;
    this.offsetY = y - shape.y;
  }

  updateMovement(event: MouseEvent, canvas: HTMLCanvasElement): Shape | null {
    if (!this.isMoving || !this.selectedShape) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const snappedX = this.gridService.snapToGrid(x - this.offsetX);
    const snappedY = this.gridService.snapToGrid(y - this.offsetY);

    this.selectedShape.x = snappedX;
    this.selectedShape.y = snappedY;
    return this.selectedShape;
  }

  stopMoving(): void {
    this.isMoving = false;
    this.selectedShape = null;
  }

  isShapeMoving(): boolean {
    return this.isMoving;
  }
}
