import { motion } from "framer-motion";

export default function Background({ color }: { color: string }) {
  return (
    <motion.div
      className="fixed inset-0 -z-10 bg-[#111]"
      animate={{ backgroundColor: color }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  );
}