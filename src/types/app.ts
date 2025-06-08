export type Memory =
  | { tex: string, svg?: string }
  | { svg: string, tex?: string }

export enum ToolType {
  Pen,
  Brush,
  Eraser,
  Free,
}
