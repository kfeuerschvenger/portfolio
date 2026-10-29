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
  // Read once on mount: the full text is shown at once and nothing animates for these users
  const [reducedMotion] = useState(
    () =>
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  // Keep the latest callback in a ref so a new function identity does not restart the typing effect
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (reducedMotion) onCompleteRef.current?.();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !started) return;

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
  }, [text, speed, started, reducedMotion]);

  // Screen readers get the whole text up front instead of one character at a time
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{reducedMotion ? text : displayedText}</span>
      {!reducedMotion && (
        <span aria-hidden="true" className="cursor-blink text-primary">▌</span>
      )}
    </span>
  );
};
