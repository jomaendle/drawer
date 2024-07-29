import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, viewChild } from '@angular/core';

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

  ngOnInit(): void {
    this.ctx = this.canvas().nativeElement.getContext('2d');
    this.drawAllShapes();
  }

  save(): void {
    const dataUrl = this.canvas().nativeElement.toDataURL();
    console.log(dataUrl); // You can send this dataUrl to the backend to save the image
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
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log('startDrawing', x, y, this.currentShape);

    if (this.currentShape) {
      this.currentShape.x = x;
      this.currentShape.y = y;
    }
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || !this.currentShape) return;

    const rect = this.canvas().nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.currentShape.width = Math.abs(x - this.currentShape.x);
    this.currentShape.height = Math.abs(y - this.currentShape.y);

    console.log('draw', x, y, this.currentShape);

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
  }

  stopDrawing(): void {
    this.isDrawing = false;
    if (this.currentShape) {
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
      this.ctx.arc(
        shape.x + shape.width / 2,
        shape.y + shape.height / 2,
        shape.width / 2,
        0,
        2 * Math.PI,
      );
      this.ctx.fill();
    }

    if (shape.isHovered) {
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 3;
      shape.type === 'rectangle'
        ? this.ctx.rect(shape.x, shape.y, shape.width, shape.height)
        : this.ctx.arc(
            shape.x + shape.width / 2,
            shape.y + shape.height / 2,
            shape.width / 2,
            0,
            2 * Math.PI,
          );
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
}
