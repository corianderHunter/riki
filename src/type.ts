import { CSSProperties } from "vue";

export enum Direction {
  VERTICAL = 'vertical',
  HORIZONTAL = "horizontal"
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = (T | U) extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

export type RikiTableProps = {
  height?: number | string,
  width?: number | string,
  style?: string | CSSProperties | Array<string | CSSProperties>,
  itemSize: number,
  direction?: Direction,
  itemRender?: Function,
  itemConfig?: any[],
  key: string,
  withIndex?: boolean
} & XOR<{ dataSource: any[] }, { itemCount: number }>


export interface ItemConfig {
  label: string,
  dataIndex: string | string[],
  width?: string | number
}