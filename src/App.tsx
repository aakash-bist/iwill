import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

type Finger = {
  id: number;
  x: number;
  y: number;
  color: string;
};

const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

const noFingerQuotes = [
  "Waiting for brave souls… 🖐️",
  "Tap the screen, daredevils! 🎯",
  "No fingers, no fun. Try again! 🎲",
  "Lonely screen… someone join the game 🤷",
];

// These are the fun “scenario questions”
const questionQuotes = [
  "Who will pay the bill? 💸",
  "Who is not lucky today? 🍀",
  "Who’s the chosen one? 👑",
  "Who’s making coffee? ☕",
  "Who’s buying the next round? 🍻",
  "Who has to sing karaoke? 🎤",
  "Who gets blamed for everything? 😅",
];

const chosenQuotes = [
  "You’ve been chosen! 👑",
  "Finger of destiny! ✨",
  "All hail the unlucky winner! 🙌",
  "Fate points at you! 👉",
];

export default function App() {
  const [fingers, setFingers] = useState<Finger[]>([]);
  const [chosenId, setChosenId] = useState<number | null>(null);
  const [bgColor, setBgColor] = useState<string>("#111");
  const [quote, setQuote] = useState<string>("");
  const counterRef = useRef<number | null>(null);

  useEffect(() => {
    if (fingers.length === 0) {
      setChosenId(null);
      setBgColor("#111");
      if (counterRef.current) clearTimeout(counterRef.current);

      // Idle quote
      setQuote(noFingerQuotes[Math.floor(Math.random() * noFingerQuotes.length)]);
    } else {
      if (counterRef.current) clearTimeout(counterRef.current);

      // Show a random “scenario question”
      setQuote(questionQuotes[Math.floor(Math.random() * questionQuotes.length)]);

      counterRef.current = window.setTimeout(() => {
        if (fingers.length > 0) {
          const randomFinger =
            fingers[Math.floor(Math.random() * fingers.length)];
          setChosenId(randomFinger.id);
          setBgColor(randomFinger.color);

          // Show chosen response
          setQuote(chosenQuotes[Math.floor(Math.random() * chosenQuotes.length)]);
        }
      }, 3000);
    }
  }, [fingers]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const newFingers: Finger[] = [];
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      newFingers.push({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        color:
          fingers.find((f) => f.id === touch.identifier)?.color ||
          getRandomColor(),
      });
    }
    setFingers(newFingers);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const moved: Finger[] = [];
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      moved.push({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        color:
          fingers.find((f) => f.id === touch.identifier)?.color ||
          getRandomColor(),
      });
    }
    setFingers(moved);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const remaining: Finger[] = [];
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      remaining.push({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        color:
          fingers.find((f) => f.id === touch.identifier)?.color ||
          getRandomColor(),
      });
    }
    setFingers(remaining);
  };

  return (
    <motion.div
      className="w-full h-screen overflow-hidden relative flex items-center justify-center"
      style={{ backgroundColor: bgColor }}
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.8 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Quotes */}
      <AnimatePresence>
        {quote && (
          <motion.div
            key={quote}
            className="absolute text-white text-2xl font-bold text-center px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            {quote}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fingers */}
      <AnimatePresence>
        {fingers.map((finger) => (
          <motion.div
            key={finger.id}
            className="absolute w-16 h-16 rounded-full border-4"
            style={{
              left: finger.x - 32,
              top: finger.y - 32,
              borderColor: finger.color,
              boxShadow: `0 0 15px ${finger.color}`,
            }}
            animate={
              chosenId === finger.id
                ? {
                    scale: [1, 1.2, 1],
                    transition: { repeat: Infinity, duration: 1.2 },
                  }
                : { scale: 1 }
            }
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
