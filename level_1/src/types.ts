export interface Room {
  id: string
  type: string
  width: number
  depth: number
  height: number
  x: number
  y: number
  rotation: number
}

export interface RoomTypeDefinition {
  type: string
  width: number
  depth: number
  height: number
  color: string
}