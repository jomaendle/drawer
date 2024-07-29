import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private readonly GRID_SIZE = 20;

  drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= width; x += this.GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += this.GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  snapToGrid(value: number): number {
    return Math.round(value / this.GRID_SIZE) * this.GRID_SIZE;
  }
}
