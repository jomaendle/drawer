import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import Konva from 'konva';
import { LayerComponent } from '../layer/layer.component';

@Component({
  selector: 'app-layer-explorer',
  standalone: true,
  imports: [CommonModule, LayerComponent],
  templateUrl: './layer-explorer.component.html',
  styleUrl: './layer-explorer.component.css',
})
export class LayerExplorerComponent {
  stage = input.required<Konva.Stage>();
  layers = input.required<Konva.Layer[]>();

  toggleExpandAll() {
    this.layers().forEach((layerData) => {
      layerData.visible() ? layerData.show() : layerData.hide();
    });
  }

  selectAll() {
    // this.layers().forEach((layerData) => {
    //   layerData.selected = true;
    //   layerData.konvaLayer.opacity(1);
    //   layerData.konvaLayer.draw();
    // });
  }

  deselectAll() {
    // this.layers().forEach((layerData) => {
    //   layerData.selected = false;
    //   layerData.konvaLayer.opacity(0.5);
    //   layerData.konvaLayer.draw();
    // });
  }

  toggleLayer(layer: any) {
    // layer.visible = !layer.visible;
    // layer.konvaLayer.visible(layer.visible);
    // layer.konvaLayer.draw();
  }
}
