import { FormControl } from '@angular/forms';
import Konva from 'konva';

export type ShapeKeys = keyof Konva.Shape;
export type RectKeys = keyof Konva.Rect;
export type CircleKeys = keyof Konva.Circle;
export type EllipseKeys = keyof Konva.Ellipse;
export type LineKeys = keyof Konva.Line;
export type RegularPolygonKeys = keyof Konva.RegularPolygon;

export type KonvaShapeKeys =
  | ShapeKeys
  | RectKeys
  | CircleKeys
  | EllipseKeys
  | LineKeys
  | RegularPolygonKeys;

export interface PropertyDefinition<T> {
  control: FormControl;
  name: T;
}

export const ShapePropertiesMap: {
  [key: string]: PropertyDefinition<ShapeKeys>[];
} = {
  'Position and Size': [
    { name: 'x', control: new FormControl(0, { nonNullable: true }) },
    { name: 'y', control: new FormControl(0, { nonNullable: true }) },
    { name: 'width', control: new FormControl(100, { nonNullable: true }) },
    { name: 'height', control: new FormControl(100, { nonNullable: true }) },
    { name: 'scaleX', control: new FormControl(1, { nonNullable: true }) },
    { name: 'scaleY', control: new FormControl(1, { nonNullable: true }) },
    { name: 'rotation', control: new FormControl(0, { nonNullable: true }) },
    { name: 'offsetX', control: new FormControl(0, { nonNullable: true }) },
    { name: 'offsetY', control: new FormControl(0, { nonNullable: true }) },
    { name: 'skewX', control: new FormControl(0, { nonNullable: true }) },
    { name: 'skewY', control: new FormControl(0, { nonNullable: true }) },
  ],
  Style: [
    {
      name: 'fill',
      control: new FormControl('#000000', { nonNullable: true }),
    },
    {
      name: 'stroke',
      control: new FormControl('#000000', { nonNullable: true }),
    },
    { name: 'strokeWidth', control: new FormControl(1, { nonNullable: true }) },
    {
      name: 'dash',
      control: new FormControl([] as number[], { nonNullable: true }),
    },
    { name: 'dashOffset', control: new FormControl(0, { nonNullable: true }) },
    { name: 'opacity', control: new FormControl(1, { nonNullable: true }) },
    { name: 'fillPatternImage', control: new FormControl(null) },
    {
      name: 'fillPatternX',
      control: new FormControl(0, { nonNullable: true }),
    },
    {
      name: 'fillPatternY',
      control: new FormControl(0, { nonNullable: true }),
    },
    {
      name: 'fillPatternOffsetX',
      control: new FormControl(0, { nonNullable: true }),
    },
    {
      name: 'fillPatternOffsetY',
      control: new FormControl(0, { nonNullable: true }),
    },
    {
      name: 'fillPatternRepeat',
      control: new FormControl('repeat', { nonNullable: true }),
    },
    {
      name: 'fillPatternRotation',
      control: new FormControl(0, { nonNullable: true }),
    },
    {
      name: 'fillLinearGradientColorStops',
      control: new FormControl([] as number[], { nonNullable: true }),
    },
    {
      name: 'fillLinearGradientStartPoint',
      control: new FormControl({ x: 0, y: 0 }, { nonNullable: true }),
    },
    {
      name: 'fillLinearGradientEndPoint',
      control: new FormControl({ x: 0, y: 0 }, { nonNullable: true }),
    },
    {
      name: 'fillRadialGradientColorStops',
      control: new FormControl([] as number[], { nonNullable: true }),
    },
    {
      name: 'fillRadialGradientStartPoint',
      control: new FormControl({ x: 0, y: 0 }, { nonNullable: true }),
    },
    {
      name: 'fillRadialGradientEndPoint',
      control: new FormControl({ x: 0, y: 0 }, { nonNullable: true }),
    },
    {
      name: 'fillRadialGradientStartRadius',
      control: new FormControl(0, { nonNullable: true }),
    },
    {
      name: 'fillRadialGradientEndRadius',
      control: new FormControl(0, { nonNullable: true }),
    },
    {
      name: 'fillEnabled',
      control: new FormControl(true, { nonNullable: true }),
    },
    {
      name: 'strokeEnabled',
      control: new FormControl(true, { nonNullable: true }),
    },
    {
      name: 'shadowEnabled',
      control: new FormControl(false, { nonNullable: true }),
    },
    {
      name: 'shadowColor',
      control: new FormControl('#000000', { nonNullable: true }),
    },
    { name: 'shadowBlur', control: new FormControl(0, { nonNullable: true }) },
    {
      name: 'shadowOffsetX',
      control: new FormControl(0, { nonNullable: true }),
    },
    {
      name: 'shadowOffsetY',
      control: new FormControl(0, { nonNullable: true }),
    },
    {
      name: 'shadowOpacity',
      control: new FormControl(1, { nonNullable: true }),
    },
  ],
  'Transformations and Animations': [
    {
      name: 'draggable',
      control: new FormControl(false, { nonNullable: true }),
    },
    { name: 'dragBoundFunc', control: new FormControl(null) },
    {
      name: 'listening',
      control: new FormControl(true, { nonNullable: true }),
    },
    {
      name: 'perfectDrawEnabled',
      control: new FormControl(true, { nonNullable: true }),
    },
    {
      name: 'hitStrokeWidth',
      control: new FormControl('auto', { nonNullable: true }),
    },
    {
      name: 'lineJoin',
      control: new FormControl('miter', { nonNullable: true }),
    },
    {
      name: 'lineCap',
      control: new FormControl('butt', { nonNullable: true }),
    },
    {
      name: 'transformsEnabled',
      control: new FormControl('all', { nonNullable: true }),
    },

    { name: 'id', control: new FormControl('', { nonNullable: true }) },
    { name: 'name', control: new FormControl('', { nonNullable: true }) },
    { name: 'visible', control: new FormControl(true, { nonNullable: true }) },
    { name: 'zIndex', control: new FormControl(0, { nonNullable: true }) },
  ],
  'Advanced/Other': [
    {
      name: 'globalCompositeOperation',
      control: new FormControl('source-over', { nonNullable: true }),
    },
  ],
};

export const RectanglePropertiesMap: {
  [key: string]: PropertyDefinition<RectKeys>[];
} = {
  'Rectangle Specific': [
    {
      name: 'cornerRadius',
      control: new FormControl(0, { nonNullable: true }),
    },
  ],
  ...ShapePropertiesMap,
};
