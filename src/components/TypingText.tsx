import { useState, useEffect, useRef } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypingText = ({ 
  text, 
  speed = 50, 
  delay = 0, 
  className = '',
  onComplete 
}: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  // Keep the latest callback in a ref so a new function identity does not restart the typing effect
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, started]);

  return (
    <span className={className}>
      {displayedText}
      <span className="cursor-blink text-primary">▌</span>
    </span>
  );
};
