export default function FloatingIcon({
  icon,
  delay,
  position,
}: {
  icon: React.ReactNode;
  delay: string;
  position: string;
}) {
  return (
    <div
      className={`absolute ${position}`}
      style={{
        animationDelay: delay,
      }}
    >
      <div className="animate-float-slow">
        <div className="rounded-lg bg-white/80 p-2 shadow-sm backdrop-blur-sm">{icon}</div>
      </div>
    </div>
  );
}
