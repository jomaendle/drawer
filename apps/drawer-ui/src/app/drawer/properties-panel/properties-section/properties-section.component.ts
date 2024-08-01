import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  PropertyDefinition,
  RectanglePropertiesMap,
  ShapeKeys,
  ShapePropertiesMap,
} from '../properties.types';
import Konva from 'konva';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-properties-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './properties-section.component.html',
  styleUrl: './properties-section.component.css',
  host: { class: 'flex h-full flex-col gap-6 w-full relative' },
})
export class PropertiesSectionComponent {
  formBuilder = inject(FormBuilder);
  formGroup: FormGroup;

  searchControl = new FormControl('');
  searchValue = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(200)),
  );

  selectedShape = input.required<Konva.Node | null>();

  propertiesMapByType = computed(() => {
    const shape = this.selectedShape();

    if (!shape) {
      return {};
    }

    if (shape instanceof Konva.Rect) {
      return RectanglePropertiesMap;
    }

    return ShapePropertiesMap;
  });

  shapeUpdated = output<Konva.Node>();

  vm = computed<{
    [K in ShapeKeys]: FormControl<unknown>;
  }>(() => {
    return {
      ...this.selectedShape()?.attrs,
      cornerRadius: this.selectedShape()?.attrs.cornerRadius || 0,
      fill: standardizeColor(this.selectedShape()?.attrs.fill),
      stroke: standardizeColor(this.selectedShape()?.attrs.stroke),
    };
  });

  shapePropertiesFilteredBySearch = computed(() => {
    const searchValue = this.searchValue();
    const propertiesMapByType = this.propertiesMapByType();

    if (!searchValue) {
      return propertiesMapByType;
    }

    const filteredPropertiesMap: {
      [key: string]: PropertyDefinition<ShapeKeys>[];
    } = {};

    for (const group in propertiesMapByType) {
      // @ts-ignore
      filteredPropertiesMap[group] = propertiesMapByType[group].filter(
        ({ name }) => {
          return name.toLowerCase().includes(searchValue.toLowerCase());
        },
      );
    }

    return filteredPropertiesMap;
  });

  shapePropsBySearchKeys = computed(() => {
    return Object.keys(this.shapePropertiesFilteredBySearch());
  });

  constructor() {
    const controls: { [K in ShapeKeys]: FormControl<unknown> } = {} as any;

    for (const group in ShapePropertiesMap) {
      ShapePropertiesMap[group].forEach(({ name, control }) => {
        controls[name] = control;
      });
    }

    this.formGroup = this.formBuilder.group(controls);

    effect(() => {
      const vm = this.vm();

      if (!vm) {
        return;
      }

      this.formGroup.patchValue(vm);
    });
  }

  onSubmitted() {
    const shape = this.selectedShape();

    if (!shape) {
      console.log('No shape selected');
      return;
    }

    shape.setAttrs(this.formGroup.value);

    this.shapeUpdated.emit(shape);
  }

  getInputType(propertyName: string): string {
    // This is a simple example. You can expand this method to return more specific input types
    if (
      propertyName.includes('Color') ||
      propertyName === 'fill' ||
      propertyName === 'stroke' ||
      propertyName === 'shadowColor'
    ) {
      return 'color';
    }
    if (
      propertyName.includes('Enabled') ||
      propertyName === 'draggable' ||
      propertyName === 'visible' ||
      propertyName === 'listening'
    ) {
      return 'checkbox';
    }
    return 'text'; // Fallback to text input
  }
}

function standardizeColor(str: string) {
  const ctx = document.createElement('canvas').getContext('2d');

  if (!ctx) {
    return str;
  }

  ctx.fillStyle = str;
  return ctx.fillStyle;
}
