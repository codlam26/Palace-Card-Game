import { motion } from "framer-motion";
import clsx from "clsx"; // Optional: if using clsx for className merge (or just use template string)

interface CardProps {
  card: { suit: string; value: string; id: string };
  isFaceUp?: boolean;
  isStatic?: boolean;
  layoutId?: string;
  onClick?: () => void;
  className?: string;
}

export default function Card({
  card,
  isFaceUp = false,
  isStatic = false,
  layoutId,
  onClick,
  className = "",
}: CardProps) {
  // Build the SVG filename
  const filename = `${card.value}${card.suit[0]}.svg`;
  const src = `/cards-svg/${filename}`;

  return (
    <motion.div
      layoutId={layoutId}
      className={clsx("w-24 h-36 perspective cursor-pointer", className)}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-500"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back face (face-down) */}
        <div className="absolute w-full h-full bg-white border-2 rounded-md shadow-lg flex items-center justify-center text-xl font-bold backface-hidden">
          <img
            src={`/cards-svg/Card_back.svg`}
            alt="Card Back"
            draggable={false}
            style={{
              userSelect: "none",
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Front face (face-up) */}
        {isFaceUp || isStatic ? (
          <div className="absolute w-full h-full bg-white border-2 rounded-lg shadow-lg flex items-center justify-center text-xl font-bold backface-hidden">
            <img
              src={src}
              alt={`${card.value} of ${card.suit}`}
              draggable={false}
              style={{
              userSelect: "none",
            }}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="absolute w-full h-full bg-blue-600 text-white border rounded-lg shadow-lg flex items-center justify-center text-xl font-bold"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <img
              src={`/cards-svg/Card_back.svg`}
              alt="Card Back"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
