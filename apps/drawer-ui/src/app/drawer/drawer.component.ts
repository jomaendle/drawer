import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridService, ShapeService } from '@core/draw-engine';
import { NgIcon } from '@ng-icons/core';
import Konva from 'konva';
import { Node } from 'konva/lib/Node';
import { filter, fromEvent, map, skip } from 'rxjs';
import { ShapeContextMenuComponent } from './shape-context-menu/shape-context-menu.component';
@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIcon,
    ShapeContextMenuComponent,
  ],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
})
export class DrawerComponent {
  container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  #shapeService = inject(ShapeService);
  #overlay = inject(Overlay);

  layers = this.#shapeService.layers;

  layer = computed(() => {
    return this.layers().at(-1);
  });

  stage = computed(() => {
    const windowWidth = window.innerWidth;

    const stage = new Konva.Stage({
      container: this.container().nativeElement,
      width: windowWidth,
      fill: 'red',
      height: 600,
    });

    stage.on('click', (e) => {
      const isTargetShape = e.target instanceof Konva.Shape;
      this.#shapeService.selectedShape.set(
        isTargetShape ? (e.target as Konva.Shape) : null,
      );
    });

    return stage;
  });

  isTransformKey$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    map((event) => event.key === 't' && event.ctrlKey),
    filter((isTransformKey) => isTransformKey),
  );

  isEnterKey$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    map((event) => event.key === 'Enter'),
    filter((isEnterKey) => isEnterKey),
  );

  constructor(private gridService: GridService) {
    effect(() => {
      const c = this.#shapeService.layers();
      console.log('this.#shapeService.layerChanged', c);
    });

    this.isTransformKey$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.addTransformer());

    this.isEnterKey$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.#shapeService.stopTransformer(this.stage()));
  }

  addRectangularShape(): void {
    const layer = this.layer();

    if (!layer) {
      console.info('No layer found, creating a new one');

      this.#shapeService.addLayer(this.stage());
      this.addRectangularShape();

      return;
    }

    this.#shapeService.addRectangularShape(this.stage(), layer);
  }

  addTransformer(): void {
    const layer = this.layer();

    if (!layer) {
      console.info('No layer found, creating a new one');

      this.#shapeService.addLayer(this.stage());
      this.addTransformer();

      return;
    }

    const selectedShape = this.#shapeService.selectedShape();

    if (!selectedShape) {
      console.error('No shape selected');
      return;
    }

    this.#shapeService.addTransformer(this.stage(), layer, [selectedShape]);
  }

  addCircleShape(): void {
    const layer = this.layer();

    if (!layer) {
      console.info('No layer found, creating a new one');

      this.#shapeService.addLayer(this.stage());
      this.addCircleShape();

      return;
    }

    this.#shapeService.addCircleShape(this.stage(), layer);
  }

  addTriangleShape(): void {
    const layer = this.layer();

    if (!layer) {
      console.info('No layer found, creating a new one');

      this.#shapeService.addLayer(this.stage());
      this.addTriangleShape();
      return;
    }

    this.#shapeService.addTriangleShape(this.stage(), layer);
  }

  addLineShape(): void {
    const layer = this.layer();

    if (!layer) {
      console.error('No layer found');
      return;
    }

    this.#shapeService.addLineShape(this.stage(), layer);
  }

  addTextShape(): void {
    const layer = this.layer();

    if (!layer) {
      console.error('No layer found');
      return;
    }

    this.#shapeService.addTextShape(this.stage(), layer);
  }

  clearCanvas(): void {
    this.#shapeService.clearCanvas(this.stage());
  }

  openContextMenu(event: MouseEvent): void {
    const ref = this.#overlay.create({
      hasBackdrop: false,
      positionStrategy: this.#overlay
        .position()
        .global()
        .left(event.clientX + 20 + 'px')
        .top(event.clientY + 'px'),
    });

    const portal = new ComponentPortal(ShapeContextMenuComponent);
    ref
      .outsidePointerEvents()
      .pipe(skip(1))
      .subscribe(() => {
        ref.dispose();
      });

    ref.attach(portal);
  }

  exportCanvas(): void {
    this.stage().setAttrs({
      fill: 'white',
    });
    const dataURL = this.stage().toDataURL();
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  addLayer(): void {
    this.#shapeService.addLayer(this.stage());
  }
}
