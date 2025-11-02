import { useEffect, useRef, useState } from "react";

interface ScrollingTextProps {
  text: string;
  className?: string;
}

const ScrollingText = ({ text, className = "" }: ScrollingTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  if (!isOverflowing) {
    return <div className={`truncate ${className}`}>{text}</div>;
  }

  return (
    <div ref={textRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-block animate-scroll-text">
        {text}
        <span className="px-8">{text}</span>
      </div>
    </div>
  );
};

export default ScrollingText;
