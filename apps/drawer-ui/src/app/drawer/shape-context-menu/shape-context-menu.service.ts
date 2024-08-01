import { inject, Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ContextAction,
  ShapeContextMenuComponent,
} from './shape-context-menu.component';
import { skip } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';
import { ShapeService } from '@core/draw-engine';
import Konva from 'konva';

@Injectable({
  providedIn: 'root',
})
export class ShapeContextMenuService {
  #overlay = inject(Overlay);
  #shapeService = inject(ShapeService);

  openContextMenu(
    event: MouseEvent,
    stage?: Konva.Stage,
    layer?: Konva.Layer,
  ): void {
    if (!stage || !layer) {
      console.error('Stage or Layer not provided');

      return;
    }

    const ref = this.#overlay.create({
      hasBackdrop: false,
      positionStrategy: this.#overlay
        .position()
        .global()
        .left(event.clientX + 12 + 'px')
        .top(event.clientY + 12 + 'px'),
    });

    const portal = new ComponentPortal(ShapeContextMenuComponent);

    ref
      .outsidePointerEvents()
      .pipe(skip(1))
      .subscribe(() => {
        ref.dispose();
      });

    const compRef = ref.attach(portal);

    compRef.instance.selection.subscribe((action: ContextAction) => {
      const selectedShape = this.#shapeService.selectedShape();

      if (!selectedShape) {
        ref.dispose();
        return;
      }

      switch (action) {
        case 'transform':
          this.addTransformer(stage, layer);
          break;
        case 'delete':
          this.deleteShape(selectedShape, stage);
          break;
        case 'moveUp':
          selectedShape.moveUp();
          break;
        case 'moveDown':
          selectedShape.moveDown();
          break;
        case 'moveToTop':
          selectedShape.moveToTop();
          break;
        case 'moveToBottom':
          selectedShape.moveToBottom();
          break;
        case 'copy':
          this.#shapeService.copyShape(stage, layer, selectedShape);
      }

      ref.dispose();
    });
  }

  deleteShape(shape: Konva.Node, stage: Konva.Stage): void {
    const id = shape.attrs.id;
    const shapeFound = stage.findOne(`#${id}`);

    if (!shapeFound) {
      return;
    }

    this.#shapeService.deleteShape(stage, shapeFound);
  }

  addTransformer(stage: Konva.Stage, layer: Konva.Layer): void {
    const selectedShape = this.#shapeService.selectedShape();

    if (!selectedShape) {
      console.error('No shape selected');
      return;
    }

    this.#shapeService.addTransformer(stage, layer, [selectedShape]);
  }
}
