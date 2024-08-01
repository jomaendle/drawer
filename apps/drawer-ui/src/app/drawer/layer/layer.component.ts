import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { ShapeService } from '@core/draw-engine';
import Konva from 'konva';
import { GroupComponent } from '../group/group.component';
import { ShapeContextMenuService } from '../shape-context-menu/shape-context-menu.service';

@Component({
  selector: 'app-layer',
  standalone: true,
  imports: [CommonModule, GroupComponent],
  templateUrl: './layer.component.html',
  styleUrl: './layer.component.css',
  host: { class: 'block overflow-hidden' },
})
export class LayerComponent {
  shapeContextMenuService = inject(ShapeContextMenuService);

  stage = input.required<Konva.Stage>();
  layer = input.required<Konva.Layer>();
  toggle = output<Konva.Layer>();

  shapeService = inject(ShapeService);

  onShapeClick(shape: Konva.Node) {
    const res = this.stage().findOne(`#${shape.attrs.id}`);
    if (res) {
      this.shapeService.selectedShape.set(res as Konva.Shape);
    }
  }

  onShapeRightClick(event: MouseEvent) {
    this.shapeContextMenuService.openContextMenu(
      event,
      this.stage(),
      this.layer(),
    );
  }
}
