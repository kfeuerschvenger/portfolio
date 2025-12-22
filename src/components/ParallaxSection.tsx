import { type ReactNode, useEffect, useRef, useState } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  id?: string;
}

export const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className = '',
  id 
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
          setIsVisible(true);
          const scrolled = windowHeight - rect.top;
          setOffset(scrolled * speed);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: `translateY(${offset * 0.1}px)`,
      }}
    >
      <div 
        className={`transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {children}
      </div>
    </section>
  );
};
