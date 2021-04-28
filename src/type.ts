import { CSSProperties } from "vue";

export enum Direction {
  VERTICAL = 'vertical',
  HORIZONTAL = "horizontal"
}

export interface RikiListProps {
  height: number | string,
  width: number | string,
  style: string | CSSProperties | Array<string | CSSProperties>,
  itemSize: number,
  itemCount: number,
  Direction: Direction
}