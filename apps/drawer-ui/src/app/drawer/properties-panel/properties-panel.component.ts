import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import Konva from 'konva';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertiesSectionComponent } from './properties-section/properties-section.component';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PropertiesSectionComponent,
  ],
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.css',
  host: { class: 'block p-4' },
})
export class PropertiesPanelComponent {
  selectedShape = input.required<Konva.Node | null>();

  shapeUpdated = output<Konva.Node>();

  onSubmit(shape: Konva.Node) {
    if (!shape) {
      return;
    }

    const updatedShape = shape.setAttrs({
      ...shape,
    });

    this.shapeUpdated.emit(updatedShape);
  }
}
