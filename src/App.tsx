import React, { useState } from "react";
import { generateMap } from "./generate";
import { DungeonMap } from "./types";
import { Map } from "./Map";

export const App: React.FC = () => {
  const [map, setMap] = useState<DungeonMap | undefined>();

  return (
    <div>
      <Map map={map} />
      <button onClick={() => setMap(generateMap(3, 8, 50))}>Generate</button>
    </div>
  );
};
