import { useState, useEffect } from "react";

// Reference public assets directly
const squiggles = ["/squiggle1.svg", "/squiggle2.svg", "/squiggle3.svg"];

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
