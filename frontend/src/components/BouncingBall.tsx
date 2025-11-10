interface BouncingBallProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const BouncingBall = ({ size = "md", color = "bg-red-500" }: BouncingBallProps) => {
  const sizeClasses = {
    sm: { container: "h-8 w-8", ball: "w-2 h-2" },
    md: { container: "h-16 w-16", ball: "w-4 h-4" },
    lg: { container: "h-40 w-32", ball: "w-8 h-8" },
  };

  const { container, ball } = sizeClasses[size];

  return (
    <>
      <style>{`
        @keyframes bounce-smooth {
          0%, 100% {
            transform: translateY(0) scaleY(1);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-100%) scaleY(1.05);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
          95% {
            transform: translateY(0) scaleY(0.95) scaleX(1.05);
          }
        }
        .bounce-ball {
          animation: bounce-smooth 1s infinite;
        }
      `}</style>
      <div className={`relative ${container} flex items-end justify-center`}>
        <div className={`${ball} ${color} rounded-full bounce-ball shadow-2xl`}></div>
      </div>
    </>
  );
};

export default BouncingBall;
