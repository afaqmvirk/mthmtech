import { useState, useEffect, useCallback, memo, useRef } from "react";

const CHARS = "αβγδεζηθικλμνξοπρστυφχψω0123456789!?/\\|{}[]<>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Store triggers and layout info globally within the component file
// We use a prefix to distinguish between desktop and mobile walls
const charTriggers: Record<string, (type: 'primary' | 'secondary') => void> = {};
let currentCols = 0;
let lastHoveredIndex = -1;
let lastHoverTime = 0;

const DigitalChar = memo(function DigitalChar({ 
  index, 
  total, 
  prefix,
  isInteractable = true
}: { 
  index: number, 
  total: number, 
  prefix: string,
  isInteractable?: boolean
}) {
  const [char, setChar] = useState("");
  const [status, setStatus] = useState<'idle' | 'primary' | 'secondary'>('idle');

  const getRandomChar = useCallback(() => CHARS[Math.floor(Math.random() * CHARS.length)], []);

  useEffect(() => {
    setChar(getRandomChar());
  }, [getRandomChar]);

  const trigger = useCallback((type: 'primary' | 'secondary') => {
    setChar(Math.random() > 0.5 ? "1" : "0");
    setStatus(type);
  }, []);

  const triggerKey = `${prefix}-${index}`;

  useEffect(() => {
    charTriggers[triggerKey] = trigger;
    return () => { delete charTriggers[triggerKey]; };
  }, [triggerKey, trigger]);

  useEffect(() => {
    if (status !== 'idle') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setChar(getRandomChar());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, getRandomChar]);

  const handleMouseEnter = () => {
    if (!isInteractable) return;
    
    const now = Date.now();
    const cols = currentCols;

    // Fixed path interpolation (only for desktop interactable wall)
    if (prefix === 'd' && lastHoveredIndex !== -1 && (now - lastHoverTime) < 150) {
      const x1 = lastHoveredIndex % cols;
      const y1 = Math.floor(lastHoveredIndex / cols);
      const x2 = index % cols;
      const y2 = Math.floor(index / cols);

      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.min(Math.round(dist * 1.5), 50);

      for (let i = 1; i < steps; i++) {
        const ix = Math.round(x1 + (dx * i) / steps);
        const iy = Math.round(y1 + (dy * i) / steps);
        const idx = iy * cols + ix;
        const key = `${prefix}-${idx}`;
        if (charTriggers[key]) {
          charTriggers[key]('secondary');
        }
      }
    }

    lastHoveredIndex = index;
    lastHoverTime = now;
    
    trigger('primary');
    
    const neighbors = [
      index - 1, index + 1,
      index - cols, index + cols,
      index - cols - 1, index - cols + 1,
      index + cols - 1, index + cols + 1
    ];

    neighbors.forEach(i => {
      const key = `${prefix}-${i}`;
      if (i >= 0 && i < total && charTriggers[key]) {
        charTriggers[key]('secondary');
      }
    });
  };

  const getClassName = () => {
    let base = "inline-block pointer-events-auto select-none ";
    if (status === 'primary') return base + "text-teal-400 font-bold transition-none scale-110";
    if (status === 'secondary') return base + "text-teal-600/60 font-medium transition-none";
    return base + "text-teal-900/25 transition-colors duration-1000 ease-out";
  };

  return (
    <span 
      onMouseEnter={prefix === 'd' && isInteractable ? handleMouseEnter : undefined}
      className={getClassName()}
      style={{ width: '1.2ch', textAlign: 'center' }}
    >
      {char}
    </span>
  );
});

export function DigitalWall() {
  const containerRef = useRef<HTMLDivElement>(null);
  const countDesktop = 5000;
  const countMobile = 1500;
  const [isInteractable, setIsInteractable] = useState(false);

  useEffect(() => {
    const updateCols = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const firstChar = containerRef.current.querySelector('span');
        const charWidth = firstChar ? firstChar.offsetWidth : 20;
        currentCols = Math.max(1, Math.floor(width / charWidth));
      }
    };

    updateCols();
    window.addEventListener('resize', updateCols);
    const timer = setTimeout(updateCols, 200);
    
    // Disable interaction for 14 seconds (duration of the main entrance timeline)
    const interactionTimer = setTimeout(() => setIsInteractable(true), 14000);
    
    return () => {
      window.removeEventListener('resize', updateCols);
      clearTimeout(timer);
      clearTimeout(interactionTimer);
    };
  }, []);

  return (
    <>
      {/* Desktop Wall */}
      <div 
        ref={containerRef}
        className="hidden lg:block absolute left-[800px] right-0 top-0 bottom-0 overflow-hidden z-20 select-none font-mono text-2xl leading-none pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 500px)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 500px)'
        }}
      >
        <div className={`flex flex-wrap h-full w-full content-start opacity-0 animate-simple-fade delay-2 ${isInteractable ? '' : 'pointer-events-none'}`}>
          {Array.from({ length: countDesktop }).map((_, i) => (
            <DigitalChar key={`d-${i}`} index={i} total={countDesktop} prefix="d" isInteractable={isInteractable} />
          ))}
        </div>
      </div>

      <div 
        className="lg:hidden absolute top-0 left-0 right-0 h-[45vh] overflow-hidden pointer-events-none z-0 select-none font-mono text-xl leading-none"
        style={{
          maskImage: 'linear-gradient(to top, transparent, black 150px)',
          WebkitMaskImage: 'linear-gradient(to top, transparent, black 150px)'
        }}
      >
        <div className="flex flex-wrap h-full w-full content-start opacity-20 animate-simple-fade delay-1 pointer-events-none">
          {Array.from({ length: countMobile }).map((_, i) => (
            <DigitalChar key={`m-${i}`} index={i} total={countMobile} prefix="m" />
          ))}
        </div>
      </div>
    </>
  );
}
