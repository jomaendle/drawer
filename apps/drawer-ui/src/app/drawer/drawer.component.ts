import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, viewChild } from '@angular/core';

const GRID_SIZE = 20;

interface Shape {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  color: string;
  layer: number;
  isHovered?: boolean;
}

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
})
export class DrawerComponent {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  isDrawing = false;
  shapes = signal<Shape[]>([]);
  private currentShape: Shape | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private selectedShape?: Shape | null = null;
  offsetX = 0;
  offsetY = 0;

  ngOnInit(): void {
    this.ctx = this.canvas().nativeElement.getContext('2d');
    this.drawAllShapes();
  }

  save(): void {
    const dataUrl = this.canvas().nativeElement.toDataURL();
    console.log(dataUrl); // You can send this dataUrl to the backend to save the image
  }

  drawGrid(): void {
    if (!this.ctx) return;

    const width = this.canvas().nativeElement.width;
    const height = this.canvas().nativeElement.height;
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= width; x += GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }
  }

  isMouseOverShape(shape: Shape, mouseX: number, mouseY: number): boolean {
    mouseX = this.snapToGrid(mouseX);
    mouseY = this.snapToGrid(mouseY);

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

    //check if we are moving a shape
    const shape = this.shapes().find((shape) => shape.isHovered);
    this.selectedShape = shape;
    console.log('startDrawing', shape);

    const rect = this.canvas().nativeElement.getBoundingClientRect();
    const x = this.snapToGrid(event.clientX - rect.left);
    const y = this.snapToGrid(event.clientY - rect.top);

    this.offsetX = x - (shape?.x ?? 0);
    this.offsetY = y - (shape?.y ?? 0);

    console.log('startDrawing', x, y, this.currentShape);

    if (this.currentShape) {
      this.currentShape.x = x;
      this.currentShape.y = y;
    }
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || !this.currentShape) return;

    const rect = this.canvas().nativeElement.getBoundingClientRect();
    const x = this.snapToGrid(event.clientX - rect.left);
    const y = this.snapToGrid(event.clientY - rect.top);

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

  handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas().nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.shapes().forEach(
      (shape) => (shape.isHovered = this.isMouseOverShape(shape, x, y)),
    );
    this.drawAllShapes();

    if (this.isDrawing && this.currentShape) {
      this.draw(event);
    }

    if (this.isDrawing && this.selectedShape) {
      const snappedX = this.snapToGrid(x - this.offsetX);
      const snappedY = this.snapToGrid(y - this.offsetY);
      this.selectedShape.x = snappedX;
      this.selectedShape.y = snappedY;
      this.drawAllShapes();
    }
  }

  stopDrawing(): void {
    this.isDrawing = false;

    if (
      this.currentShape &&
      ((this.currentShape.type === 'rectangle' &&
        this.currentShape.width &&
        this.currentShape.height) ||
        (this.currentShape?.type === 'circle' && this.currentShape.radius > 0))
    ) {
      this.shapes.set([...this.shapes(), this.currentShape]);
      this.currentShape = null;
      this.drawAllShapes();
    }
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

    if (shape.isHovered) {
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
    this.ctx?.clearRect(
      0,
      0,
      this.canvas().nativeElement.width,
      this.canvas().nativeElement.height,
    );

    this.drawGrid();
    this.shapes()
      .sort((a, b) => a.layer - b.layer) // Sort shapes by layer
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
      layer: this.shapes.length,
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
      layer: this.shapes.length,
      height: 40,
      width: 40,
    };
  }

  clearCanvas(): void {
    this.shapes.set([]);
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

  selectShape(shape: Shape): void {
    this.shapes.set(
      this.shapes().map((s) => {
        s.isHovered = false;
        return s;
      }),
    );
    shape.isHovered = true;
    this.drawAllShapes();
  }

  deleteShape(shape: Shape): void {
    this.shapes.set(this.shapes().filter((s) => s !== shape));
    this.drawAllShapes();
  }

  snapToGrid(value: number): number {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }
}
