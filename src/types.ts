export interface DungeonMap {
  rooms: Room[];
  size: number;
}

export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
  doors: Door[];
}

export interface Door {
  x: number;
  y: number;
}

export interface RoomConfig {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}
