export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export interface Message {
  type: string;
  pixels?: Pixel[];
}