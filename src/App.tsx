import  { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { pickUniqueColor } from "./utils/colors";
import Background from "./components/Background";
import FingerCircle from "./components/FingerCircle";

type Finger = {
  id: number; // Touch.identifier
  x: number;
  y: number;
  color: string;
};

type FingerMap = Map<number, Finger>;

export default function App() {
  const [fingers, setFingers] = useState<FingerMap>(new Map());
  const [chosenId, setChosenId] = useState<number | null>(null);
  const [bgColor, setBgColor] = useState<string>("#111");

  const selectionTimer = useRef<number | null>(null);

  // helpers
  const scheduleSelection = (delayMs = 2000) => {
    if (selectionTimer.current) window.clearTimeout(selectionTimer.current);
    if (fingers.size === 0) return;
    selectionTimer.current = window.setTimeout(() => {
      const ids = Array.from(fingers.keys());
      if (ids.length === 0) return;
      const picked = ids[Math.floor(Math.random() * ids.length)];
      const pickedFinger = fingers.get(picked)!;
      setChosenId(picked);
      setBgColor(pickedFinger.color);
    }, delayMs);
  };

  // Clean up timer on unmount
  useEffect(() => () => { if (selectionTimer.current) window.clearTimeout(selectionTimer.current); }, []);

  // Touch handlers
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      e.preventDefault();
      setChosenId(null); // reset choice when new round starts
      setFingers(prev => {
        const next = new Map(prev);
        const used = new Set(Array.from(next.values()).map(f => f.color));
        for (const t of Array.from(e.changedTouches)) {
          if (!next.has(t.identifier)) {
            next.set(t.identifier, {
              id: t.identifier,
              x: t.clientX,
              y: t.clientY,
              color: pickUniqueColor(used),
            });
          }
        }
        return next;
      });
    };

    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      setFingers(prev => {
        const next = new Map(prev);
        for (const t of Array.from(e.changedTouches)) {
          const f = next.get(t.identifier);
          if (f) {
            f.x = t.clientX;
            f.y = t.clientY;
            next.set(t.identifier, f);
          }
        }
        return next;
      });
    };

    const onEnd = (e: TouchEvent) => {
      e.preventDefault();
      setFingers(prev => {
        const next = new Map(prev);
        for (const t of Array.from(e.changedTouches)) {
          next.delete(t.identifier);
        }
        if (next.size === 0) {
          setChosenId(null);
          setBgColor("#111");
          if (selectionTimer.current) window.clearTimeout(selectionTimer.current);
        }
        return next;
      });
    };

    const opts: AddEventListenerOptions = { passive: false };
    window.addEventListener("touchstart", onStart, opts);
    window.addEventListener("touchmove", onMove, opts);
    window.addEventListener("touchend", onEnd, opts);
    window.addEventListener("touchcancel", onEnd, opts);

    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  // When the finger set changes, (re)schedule selection unless one is already chosen
  useEffect(() => {
    if (fingers.size > 0 && chosenId === null) {
      scheduleSelection(2000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fingers, chosenId]);

  return (
    <div className="h-screen w-screen relative overflow-hidden touch-none select-none text-white">
      <Background color={bgColor} />

      {/* helper text */}
      <div className="absolute inset-x-0 top-4 text-center text-sm/relaxed text-white/70 px-4">
        <p>Place 2+ fingers anywhere. Drag around. After ~2s one finger is picked.</p>
        <p>Lifting all fingers resets.</p>
      </div>

      {/* active fingers */}
      <AnimatePresence>
        {Array.from(fingers.values()).map(f => (
          <FingerCircle key={f.id} x={f.x} y={f.y} color={f.color} chosen={f.id === chosenId} />
        ))}
      </AnimatePresence>

      {/* Replay button after pick (optional) */}
      {chosenId !== null && (
        <button
          className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-2xl px-5 py-2 bg-white/10 hover:bg-white/15 backdrop-blur border border-white/15 shadow-lg"
          onClick={() => {
            setChosenId(null);
            setBgColor("#111");
            // keep current fingers but reschedule a new random pick
            scheduleSelection(1500);
          }}
        >
          Replay
        </button>
      )}
    </div>
  );
}