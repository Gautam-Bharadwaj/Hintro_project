"use client";

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
  src?: string;
}

const COLORS = ["#7c5cff", "#22c55e", "#f97316", "#0ea5e9", "#ec4899", "#eab308"];

function hashColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

export default function Avatar({ name, size = 32, color, src }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="inline-block shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const bg = color || hashColor(name);
  return (
    <div
      className="inline-flex shrink-0 items-center justify-center rounded-full text-white font-semibold"
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  );
}
