import { motion } from "framer-motion";

type Props = {
  x: number;
  y: number;
  color: string;
  chosen?: boolean;
};

export default function FingerCircle({ x, y, color, chosen }: Props) {
  const size = 84; // diameter in px
  const offset = size / 2;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        top: y - offset,
        left: x - offset,
        width: size,
        height: size,
        boxShadow: `0 0 24px 6px ${color}55, inset 0 0 0 4px ${color}`,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: chosen ? [1, 1.15, 1] : [1, 1.03, 1],
        opacity: 1,
        filter: chosen ? "brightness(1.2)" : "brightness(1)",
      }}
      transition={{ duration: chosen ? 0.8 : 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}