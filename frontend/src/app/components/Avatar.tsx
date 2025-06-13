import React from "react";

interface AvatarCircleProps {
  playerName: string;
  color?: string;
  borderColor?: string;
}

export default function AvatarCircle({
  playerName,
  color = "bg-blue-500",
  borderColor = "ring-gray-300",
}: AvatarCircleProps) {
  const initials = playerName.slice(0, 2).toUpperCase();

  return (
    <div
      className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center text-sm font-bold shadow ring-2 ${borderColor}`}
    >
      {initials}
    </div>
  );
}