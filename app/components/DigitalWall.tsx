import { useEffect, useRef, useState, useCallback } from "react";

const CHARS = "αβγδεζηθικλμνξοπρστυφχψω0123456789!?/\\|{}[]<>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

interface GridCell {
  char: string;
  triggerTime: number;
  status: 'idle' | 'primary' | 'secondary';
  hasSwitchedBack: boolean; // Tracking for single switch
}

export function DigitalWall() {
  const desktopCanvasRef = useRef<HTMLCanvasElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isInteractable, setIsInteractable] = useState(false);
  
  const desktopGrid = useRef<GridCell[]>([]);
  const mobileGrid = useRef<GridCell[]>([]);
  
  const lastMousePos = useRef<{ x: number, y: number } | null>(null);
  const lastMouseTime = useRef<number>(0);
  
  const desktopDim = useRef({ width: 0, height: 0, cols: 0, rows: 0, charW: 0, charH: 0 });
  const mobileDim = useRef({ width: 0, height: 0, cols: 0, rows: 0, charW: 0, charH: 0 });

  const initGrid = (cols: number, rows: number) => {
    return Array.from({ length: cols * rows }, () => ({
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      triggerTime: 0,
      status: 'idle' as const,
      hasSwitchedBack: true
    }));
  };

  const updateDimensions = useCallback(() => {
    // Desktop
    if (desktopCanvasRef.current) {
        const p = desktopCanvasRef.current.parentElement!;
        const w = p.offsetWidth, h = p.offsetHeight;
        const dpr = window.devicePixelRatio || 1;
        desktopCanvasRef.current.width = w * dpr;
        desktopCanvasRef.current.height = h * dpr;
        const charW = 24 * 0.7, charH = 24;
        const cols = Math.ceil(w / charW), rows = Math.ceil(h / charH);
        desktopDim.current = { width: w, height: h, cols, rows, charW, charH };
        desktopGrid.current = initGrid(cols, rows);
    }
    // Mobile
    if (mobileCanvasRef.current) {
        const p = mobileCanvasRef.current.parentElement!;
        const w = p.offsetWidth, h = p.offsetHeight;
        const dpr = window.devicePixelRatio || 1;
        mobileCanvasRef.current.width = w * dpr;
        mobileCanvasRef.current.height = h * dpr;
        const charW = 20 * 0.7, charH = 20;
        const cols = Math.ceil(w / charW), rows = Math.ceil(h / charH);
        mobileDim.current = { width: w, height: h, cols, rows, charW, charH };
        mobileGrid.current = initGrid(cols, rows);
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const it = setTimeout(() => setIsInteractable(true), 8000);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(it);
    };
  }, [updateDimensions]);

  // Main animation loop
  useEffect(() => {
    let rafId: number;
    let frameCount = 0;

    const render = () => {
      // Optimization: If not interactable, render a few frames to settle, then stop.
      // This ensures the wall is visible but uses 0 CPU during the heavy text intro animations.
      if (!isInteractable && frameCount > 5) {
        return; 
      }

      const now = Date.now();
      const dpr = window.devicePixelRatio || 1;

      // Render loop
      [
        { ref: desktopCanvasRef, dim: desktopDim, grid: desktopGrid, fontSize: 24 },
        { ref: mobileCanvasRef, dim: mobileDim, grid: mobileGrid, fontSize: 20 }
      ].forEach(({ ref, dim, grid, fontSize }) => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const { cols, rows, charW, charH } = dim.current;
        if (cols === 0) return;

        // Only clear and redraw if we have active cells OR if it's the initial static render
        // But since we want to stop the loop when idle, we just draw every frame we represent.
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = `bold ${fontSize}px "CMU Typewriter Text", monospace`;
        ctx.textAlign = 'center';
        
        let lastColor = '';

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = y * cols + x;
            const cell = grid.current[i];
            if (!cell) continue;

            let color = 'rgba(20, 184, 166, 0.08)';
            if (cell.status !== 'idle') {
              const elapsed = now - cell.triggerTime;
              const holdTime = 2000;
              const fadeTime = 500;
              const totalTime = holdTime + fadeTime;
              
              if (elapsed < totalTime) {
                const p = elapsed < holdTime ? 1 : 1 - ((elapsed - holdTime) / fadeTime);
                
                if (cell.status === 'primary') {
                  color = `rgba(45, 212, 191, ${0.15 + p * 0.85})`;
                } else {
                  color = `rgba(13, 148, 136, ${0.1 + p * 0.5})`;
                }

                if (!cell.hasSwitchedBack && elapsed > holdTime) {
                  cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
                  cell.hasSwitchedBack = true;
                }
              } else {
                cell.status = 'idle';
                cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
              }
            }
            
            if (color !== lastColor) {
              ctx.fillStyle = color;
              lastColor = color;
            }
            ctx.fillText(cell.char, x * charW + charW / 2, y * charH + charH * 0.8);
          }
        }
      });

      frameCount++;
      rafId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(rafId);
  }, [isInteractable]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInteractable) return;
    const { charW, charH, cols, rows } = desktopDim.current;
    const rect = desktopCanvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x2 = Math.floor((e.clientX - rect.left) / charW);
    const y2 = Math.floor((e.clientY - rect.top) / charH);
    const now = Date.now();

    const trigger = (tx: number, ty: number, st: 'primary' | 'secondary') => {
      if (tx >= 0 && tx < cols && ty >= 0 && ty < rows) {
        const c = desktopGrid.current[ty * cols + tx];
        if (c) { 
          c.status = st; 
          c.triggerTime = now; 
          c.char = Math.random() > 0.5 ? "1" : "0";
          c.hasSwitchedBack = false;
        }
      }
    };

    if (lastMousePos.current) {
        const { x: x1, y: y1 } = lastMousePos.current;
        const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
        if (now - lastMouseTime.current < 150 && dx < cols / 2 && dy < 50) {
            let cx = x1, cy = y1, err = dx - dy;
            const sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
            for(let s=0; s<100 && (cx!==x2 || cy!==y2); s++) {
                const e2 = 2 * err;
                if (e2 > -dy) { err -= dy; cx += sx; }
                if (e2 < dx) { err += dx; cy += sy; }
                trigger(cx, cy, 'secondary');
            }
        }
    }

    lastMousePos.current = { x: x2, y: y2 };
    lastMouseTime.current = now;
    trigger(x2, y2, 'primary');
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx !== 0 || dy !== 0) trigger(x2 + dx, y2 + dy, 'secondary');
      }
    }
  };

  return (
    <>
      <div className="hidden lg:block absolute left-[600px] right-0 top-0 bottom-0 overflow-hidden z-20 pointer-events-none" style={{ maskImage: 'linear-gradient(to right, transparent, transparent 100px, black 300px)', WebkitMaskImage: 'linear-gradient(to right, transparent, transparent 100px, black 300px)' }}>
        <canvas ref={desktopCanvasRef} onMouseMove={handleMouseMove} onMouseLeave={() => lastMousePos.current = null} className={`w-full h-full opacity-0 animate-simple-fade delay-2 ${isInteractable ? 'pointer-events-auto' : 'pointer-events-none'}`} />
      </div>
      <div className="lg:hidden absolute top-0 left-0 right-0 h-[45vh] overflow-hidden pointer-events-none z-0" style={{ maskImage: 'linear-gradient(to top, transparent, black 150px)', WebkitMaskImage: 'linear-gradient(to top, transparent, black 150px)' }}>
        <canvas ref={mobileCanvasRef} className="w-full h-full opacity-20 animate-simple-fade delay-1" />
      </div>
    </>
  );
}
