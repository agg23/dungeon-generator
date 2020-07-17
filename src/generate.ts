import { DungeonMap, Room, RoomConfig } from "./types";

const baseRoomConfig: RoomConfig = {
  minWidth: 3,
  maxWidth: 10,
  minHeight: 3,
  maxHeight: 3,
};

export const generateMap = (
  minRooms: number,
  maxRooms: number,
  maxSize: number
): DungeonMap => {
  const rooms: Room[] = [];

  // Initial room
  const initialWidth = getRandomInt(
    baseRoomConfig.minWidth,
    baseRoomConfig.maxWidth
  );
  const initialHeight = getRandomInt(
    baseRoomConfig.minHeight,
    baseRoomConfig.maxWidth
  );

  // Center in overall map
  rooms.push({
    x: Math.floor((maxSize - initialWidth) / 2),
    y: Math.floor((maxSize - initialHeight) / 2),
    width: initialWidth,
    height: initialHeight,
  });

  const roomCount = getRandomInt(minRooms, maxRooms);
  let totalRoomCount = 0;
  let iterationCount = 0;

  while (totalRoomCount < roomCount) {
    if (iterationCount > 100) {
      console.warn("Over 100 iterations, stopping");
      break;
    }

    const newRoom = generateRoom(rooms, maxSize);

    if (newRoom) {
      rooms.push(newRoom);
      totalRoomCount += 1;
    }

    iterationCount += 1;
  }

  return {
    rooms,
    size: maxSize,
  };
};

const generateRoom = (
  existingRooms: Room[],
  maxSize: number
): Room | undefined => {
  // Choose existing room
  const roomIndex = getRandomInt(0, existingRooms.length - 1);
  const baseRoom = existingRooms[roomIndex];

  // Choose room side
  const side = getRandomInt(0, 3);

  if (side === 0) {
    return generateXRoom("top", baseRoom, existingRooms);
  } else if (side === 1) {
    return generateXRoom("bottom", baseRoom, existingRooms);
  }

  return undefined;
};

const generateXRoom = (
  side: "top" | "bottom",
  baseRoom: Room,
  existingRooms: Room[]
): Room | undefined => {
  const { x: baseX, y: baseY, width: baseWidth, height: baseHeight } = baseRoom;

  const width = getRandomInt(baseRoomConfig.minWidth, baseRoomConfig.maxWidth);
  const height = getRandomInt(
    baseRoomConfig.minHeight,
    baseRoomConfig.maxWidth
  );

  // Both sides are shrunk by 1 to prevent doors on edges
  const baseDoorPosition = getRandomInt(1, baseWidth - 1);

  const doorX = baseX + baseDoorPosition;
  const doorY = side === "top" ? baseY + 1 + baseHeight : baseY - 1 - height;

  // if (checkForRoomAt(doorX, doorY, existingRooms)) {
  //   // Room exists here, abort
  //   return undefined;
  // }

  // Choose the alignment of the new room
  const doorPosition = getRandomInt(1, width - 1);

  const x = doorX - doorPosition;
  const y = doorY;

  const newRoom: Room = { x, y, width, height };

  if (!canPlaceRoom(newRoom, existingRooms)) {
    // Room exists, abort
    return undefined;
  }

  return newRoom;
};

const checkForRoomAt = (x: number, y: number, existingRooms: Room[]): boolean =>
  !existingRooms.reduce<boolean>(
    (prev, room) => prev && !doesRoomContain(x, y, room),
    true
  );

const doesRoomContain = (x: number, y: number, room: Room): boolean =>
  room.x <= x &&
  room.x + room.width >= x &&
  room.y <= y &&
  room.y + room.height >= y;

const canPlaceRoom = (room: Room, existingRooms: Room[]): boolean =>
  existingRooms.reduce<boolean>(
    (prev, existingRoom) => prev && !doRoomsIntersect(room, existingRoom),
    true
  );

const doRoomsIntersect = (a: Room, b: Room): boolean =>
  doesAxisIntersect(a, b, "x") && doesAxisIntersect(a, b, "y");

const doesAxisIntersect = (a: Room, b: Room, axis: "x" | "y"): boolean =>
  a.x <= b.x + b.width &&
  b.x <= a.x + a.width &&
  a.y <= b.y + b.height &&
  b.y <= a.y + b.height;

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
