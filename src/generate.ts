import { DungeonMap, Room, RoomConfig, Door } from "./types";

const baseRoomConfig: RoomConfig = {
  minWidth: 3,
  maxWidth: 10,
  minHeight: 3,
  maxHeight: 10,
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
    baseRoomConfig.maxHeight
  );

  // Center in overall map
  rooms.push({
    x: Math.floor((maxSize - initialWidth) / 2),
    y: Math.floor((maxSize - initialHeight) / 2),
    width: initialWidth,
    height: initialHeight,
    doors: [],
  });

  const roomCount = getRandomInt(minRooms, maxRooms);
  let totalRoomCount = 1;
  let iterationCount = 0;

  while (totalRoomCount < roomCount) {
    if (iterationCount > maxSize * maxSize) {
      console.warn(`Over ${maxSize * maxSize} iterations, stopping`);
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
    return generateXRoom("top", baseRoom, existingRooms, maxSize);
  } else if (side === 1) {
    return generateXRoom("bottom", baseRoom, existingRooms, maxSize);
  } else if (side === 2) {
    return generateYRoom("left", baseRoom, existingRooms, maxSize);
  } else if (side === 3) {
    return generateYRoom("right", baseRoom, existingRooms, maxSize);
  }

  return undefined;
};

const generateXRoom = (
  side: "top" | "bottom",
  baseRoom: Room,
  existingRooms: Room[],
  maxSize: number
): Room | undefined => {
  // Maintaining a unified algorithm for X and Y seems to be harder to understand/maintain than it's worth
  const { x: baseX, y: baseY, width: baseWidth, height: baseHeight } = baseRoom;

  const width = getRandomInt(baseRoomConfig.minWidth, baseRoomConfig.maxWidth);
  const height = getRandomInt(
    baseRoomConfig.minHeight,
    baseRoomConfig.maxHeight
  );

  // Both sides are shrunk by 1 to prevent doors on edges
  const baseDoorPosition = getRandomInt(1, baseWidth - 1);

  const doorX = baseX + baseDoorPosition;
  const doorY = side === "top" ? baseY : baseY + baseHeight;

  // Choose the alignment of the new room
  const doorPosition = getRandomInt(1, width - 1);

  const x = doorX - doorPosition;
  const y = doorY;

  const door: Door = {
    x: doorX,
    y: doorY,
  };

  const newRoom: Room = {
    x,
    y,
    width,
    height,
    doors: [door],
  };

  if (
    !isRoomWithinBounds(newRoom, maxSize) ||
    !canPlaceRoom(newRoom, existingRooms)
  ) {
    // Room exists, abort
    return undefined;
  }

  // Mutate base room to add door
  baseRoom.doors.push(door);

  return newRoom;
};

const generateYRoom = (
  side: "left" | "right",
  baseRoom: Room,
  existingRooms: Room[],
  maxSize: number
): Room | undefined => {
  const { x: baseX, y: baseY, width: baseWidth, height: baseHeight } = baseRoom;

  const width = getRandomInt(baseRoomConfig.minWidth, baseRoomConfig.maxWidth);
  const height = getRandomInt(
    baseRoomConfig.minHeight,
    baseRoomConfig.maxWidth
  );

  // Both sides are shrunk by 1 to prevent doors on edges
  const baseDoorPosition = getRandomInt(1, baseHeight - 1);

  const doorX = side === "left" ? baseX : baseX + baseWidth;
  const doorY = baseY + baseDoorPosition;

  // Choose the alignment of the new room
  const doorPosition = getRandomInt(1, height - 1);

  const x = doorX;
  const y = doorY - doorPosition;

  const door: Door = {
    x: doorX,
    y: doorY,
  };

  const newRoom: Room = {
    x,
    y,
    width,
    height,
    doors: [door],
  };

  if (
    !isRoomWithinBounds(newRoom, maxSize) ||
    !canPlaceRoom(newRoom, existingRooms)
  ) {
    // Room exists, abort
    return undefined;
  }

  // Mutate base room to add door
  baseRoom.doors.push(door);

  return newRoom;
};

const canPlaceRoom = (room: Room, existingRooms: Room[]): boolean =>
  existingRooms.reduce<boolean>(
    (prev, existingRoom) => prev && !doRoomsIntersect(room, existingRoom),
    true
  );

const doRoomsIntersect = (a: Room, b: Room): boolean =>
  a.x < b.x + b.width &&
  b.x < a.x + a.width &&
  a.y < b.y + b.height &&
  b.y < a.y + a.height;

const isRoomWithinBounds = (
  { x, y, width, height }: Room,
  maxSize: number
): boolean =>
  x >= 0 &&
  y >= 0 &&
  x < maxSize &&
  y < maxSize &&
  x + width < maxSize &&
  y + height < maxSize;

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
