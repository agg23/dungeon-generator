import React, { useState } from "react";

import { DungeonMap, Room } from "./types";

export interface MapProps {
  map: DungeonMap | undefined;
}

export const Map: React.FC<MapProps> = ({ map }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room>();

  return (
    <div>
      <svg
        width="800"
        height="800"
        viewBox={`0 0 ${map?.size ?? 100} ${map?.size ?? 100}`}
      >
        <defs>
          <pattern
            id="smallGrid"
            width="1"
            height="1"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 1 0 L 0 0 0 1"
              fill="none"
              stroke="gray"
              strokeWidth="0.25"
            />
          </pattern>
          <pattern
            id="grid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="10" fill="url(#smallGrid)" />
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="gray"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect x="0" y="0" width="1" height="1" fill="red" />

        {/* Key doesn't matter */}
        {map?.rooms.map((room, i) => (
          <React.Fragment key={i}>
            <rect
              {...room}
              fill={colors[i % colors.length]}
              onMouseEnter={() => setSelectedRoom(room)}
              onMouseLeave={() => setSelectedRoom(undefined)}
            />
            <text {...room} fontSize={1}>
              {i}
            </text>
            {room.doors.map((door, j) => (
              <>
                <rect
                  key={`door-${i}-${j}`}
                  {...door}
                  width={1}
                  height={1}
                  fill="black"
                />
                {j === 0 && (
                  <text {...door} fontSize={1}>
                    {i}
                  </text>
                )}
              </>
            ))}
          </React.Fragment>
        )) ?? null}
      </svg>
      {map && <div>{`${map.rooms.length} rooms generated`}</div>}
      {selectedRoom && <div>{JSON.stringify(selectedRoom)}</div>}
    </div>
  );
};

const colors = ["red", "blue", "green", "purple", "pink", "yellow", "orange"];
