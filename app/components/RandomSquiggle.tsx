import { useState, useEffect } from "react";

// Import SVG files directly
import Squiggle1 from "../../squiggle1.svg?url";
import Squiggle2 from "../../squiggle2.svg?url";
import Squiggle3 from "../../squiggle3.svg?url";

const squiggles = [Squiggle1, Squiggle2, Squiggle3];

export function RandomSquiggle() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Randomly select a squiggle on mount
    setSelectedIndex(Math.floor(Math.random() * 3));
  }, []);

  if (selectedIndex === null) {
    return <div className="squiggle-container" />;
  }

  return (
    <div className="squiggle-container">
      <img 
        src={squiggles[selectedIndex]} 
        alt="" 
        className="squiggle-svg"
        aria-hidden="true"
      />
    </div>
  );
}
