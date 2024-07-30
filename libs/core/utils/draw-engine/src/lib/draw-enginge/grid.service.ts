import { effect, Injectable, signal } from "@angular/core";
import Konva from 'konva';
import { debounceTime, fromEvent } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";

export const GRID_ID = 'grid';

const line = new Konva.Line({
  points: [],
  stroke: 'rgba(190,190,190,0.8)',

  lineCap: 'round',
  strokeWidth: 1,
  listening: false,
});

const gridLayer = new Konva.Layer(
  {
    listening: false,
    id: GRID_ID
  }

);

line.cache();

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private readonly GRID_SIZE = 20;

  resize = toSignal(fromEvent(window, 'resize').pipe(
    debounceTime(200),
  ))

  stage = signal<Konva.Stage | null>(null)

  setStage(stage: Konva.Stage): void {
    this.stage.set(stage);
  }

  drawGrid(stage: Konva.Stage, layer: Konva.Layer): void {

    console.log('xx drawGrid', stage.width(), window.innerWidth);
    // Draw vertical lines
    this.createLines(stage.width(), false, stage, layer);

    // Draw horizontal lines
    this.createLines(stage.height(), true, stage, layer);

    stage.add(layer);
  }

  constructor() {
      effect(() => {
        const stage = this.stage();
        const resize = this.resize();

        if (stage) {
          this.drawGrid(stage, gridLayer);
        }
      })
  }


  createLines(
    end: number,
    horizontalLines: boolean,
    stage: Konva.Stage,
    layer: Konva.Layer,
  ): void {
    let clone;

    for (let i = 0; i <= end; i += this.GRID_SIZE) {
      clone = line.clone({
        points: horizontalLines
          ? [i, 0, i, stage.height()]
          : [0, i, window.innerWidth, i],
      });

      // some config options to improve performance
      clone.perfectDrawEnabled(false);
      clone.shadowForStrokeEnabled(false);
      clone.transformsEnabled('position');


      layer.add(clone);
    }
  }
}
