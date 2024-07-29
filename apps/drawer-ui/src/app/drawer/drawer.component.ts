import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import {
  GridService,
  MovementService,
  Shape,
  ShapeService,
} from '@core/draw-engine';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
})
export class DrawerComponent {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  shapeService = inject(ShapeService);
  isDrawing = false;
  private currentShape: Shape | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  shapes = this.shapeService.shapes;

  constructor(
    private gridService: GridService,
    private movementService: MovementService,
  ) {}

  ngOnInit(): void {
    this.ctx = this.canvas().nativeElement.getContext('2d');
    this.drawAllShapes();
  }

  save(): void {
    const dataUrl = this.canvas().nativeElement.toDataURL();
    console.log(dataUrl); // You can send this dataUrl to the backend to save the image
  }

  handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas().nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const shapes = this.shapeService.shapes();
    shapes.forEach(
      (shape) => (shape.isHovered = this.isMouseOverShape(shape, x, y)),
    );
    this.shapeService.updateShapes(shapes);
    this.drawAllShapes();

    if (this.isDrawing && this.currentShape) {
      this.draw(event);
    }

    const movedShape = this.movementService.updateMovement(
      event,
      this.canvas().nativeElement,
    );
    if (movedShape) {
      this.drawAllShapes();
    }
  }

  stopMoving(): void {
    this.movementService.stopMoving();
  }

  isMouseOverShape(shape: Shape, mouseX: number, mouseY: number): boolean {
    if (shape.type === 'rectangle') {
      return (
        mouseX > shape.x &&
        mouseX < shape.x + shape.width &&
        mouseY > shape.y &&
        mouseY < shape.y + shape.height
      );
    } else if (shape.type === 'circle') {
      const dx = mouseX - shape.x;
      const dy = mouseY - shape.y;
      return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
    }
    return false;
  }

  startDrawing(event: MouseEvent): void {
    this.isDrawing = true;

    const rect = this.canvas().nativeElement.getBoundingClientRect();
    const x = this.gridService.snapToGrid(event.clientX - rect.left);
    const y = this.gridService.snapToGrid(event.clientY - rect.top);

    if (this.currentShape) {
      this.currentShape.x = x;
      this.currentShape.y = y;
    }

    const shape = this.shapes().find((shape) => shape.isHovered);
    if (shape) {
      this.movementService.startMoving(
        event,
        shape,
        this.canvas().nativeElement,
      );
    }
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || !this.currentShape) return;

    const rect = this.canvas().nativeElement.getBoundingClientRect();
    const x = this.gridService.snapToGrid(event.clientX - rect.left);
    const y = this.gridService.snapToGrid(event.clientY - rect.top);

    if (this.currentShape.type === 'rectangle') {
      this.currentShape.width = x - this.currentShape.x;
      this.currentShape.height = y - this.currentShape.y;
    } else if (this.currentShape.type === 'circle') {
      const dx = x - this.currentShape.x;
      const dy = y - this.currentShape.y;
      this.currentShape.radius = Math.sqrt(dx * dx + dy * dy);
    }

    this.drawAllShapes();
    this.drawShape(this.currentShape);
  }

  stopDrawing(): void {
    this.isDrawing = false;
    if (this.currentShape) {
      this.shapeService.addShape(this.currentShape);
      this.currentShape = null;
      this.drawAllShapes();
    }
    this.movementService.stopMoving();
  }

  drawShape(shape: Shape): void {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.fillStyle = shape.color;

    if (shape.type === 'rectangle') {
      this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === 'circle') {
      this.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    if (shape.isHovered || shape.isSelected) {
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      if (shape.type === 'rectangle') {
        this.ctx.rect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === 'circle') {
        this.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
      }
      this.ctx.stroke();
    }

    this.ctx.closePath();
  }

  drawAllShapes(): void {
    if (!this.ctx) return;

    this.ctx.clearRect(
      0,
      0,
      this.canvas().nativeElement.width,
      this.canvas().nativeElement.height,
    );
    this.gridService.drawGrid(
      this.ctx,
      this.canvas().nativeElement.width,
      this.canvas().nativeElement.height,
    );

    this.shapeService
      .shapes()
      .sort((a, b) => a.layer - b.layer)
      .forEach((shape) => this.drawShape(shape));
  }

  addRectangle(): void {
    this.currentShape = {
      type: 'rectangle',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      color: this.getRandomColor(),
      layer: this.shapeService.shapes().length,
      radius: 0,
    };
  }

  addCircle(): void {
    this.currentShape = {
      type: 'circle',
      x: 0,
      y: 0,
      radius: 0,
      color: this.getRandomColor(),
      layer: this.shapeService.shapes().length,
      height: 0,
      width: 0,
    };
  }

  clearCanvas(): void {
    this.shapeService.clearShapes();
    this.ctx?.clearRect(
      0,
      0,
      this.canvas().nativeElement.width,
      this.canvas().nativeElement.height,
    );
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  deleteShape(shape: Shape): void {
    this.shapeService.deleteShape(shape);
    this.drawAllShapes();
  }

  selectShape(shape: Shape): void {
    if (this.shapeService.getSelectedShape() === shape) {
      this.currentShape = null;
      this.shapeService.resetSelection();
      this.drawAllShapes();
      return;
    }

    this.shapeService.selectShape(shape);
    this.drawAllShapes();
  }
}
