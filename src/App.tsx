import React, { useState } from "react";
import { generateMap } from "./generate";
import { DungeonMap } from "./types";
import { Map } from "./Map";

export const App: React.FC = () => {
  const [minRooms, setMinRooms] = useState(5);
  const [maxRooms, setMaxRooms] = useState(13);
  const [maxSize, setMaxSize] = useState(50);
  const [map, setMap] = useState<DungeonMap | undefined>();

  return (
    <div>
      <Map map={map} />
      <div>
        <label htmlFor="minRooms">Minimum number of rooms</label>
        <input
          id="minRooms"
          defaultValue={minRooms}
          onChange={setValueIfValid(setMinRooms)}
        />
        <label htmlFor="maxRooms">Maximum number of rooms</label>
        <input
          id="maxRooms"
          defaultValue={maxRooms}
          onChange={setValueIfValid(setMaxRooms)}
        />
        <label htmlFor="maxSize">Grid size</label>
        <input
          id="maxSize"
          defaultValue={maxSize}
          onChange={setValueIfValid(setMaxSize)}
        />
      </div>
      <button onClick={() => setMap(generateMap(minRooms, maxRooms, maxSize))}>
        Generate
      </button>
    </div>
  );
};

const setValueIfValid = (dispatch: (value: number) => void) => (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const value = Number.parseInt(event.currentTarget.value, 10);

  if (value !== NaN) {
    dispatch(value);
  }
};
