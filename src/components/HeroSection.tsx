import { useState } from 'react';
import { TypingText } from './TypingText';
import profilePhoto from '../assets/profile-photo.webp';

export const HeroSection = () => {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative matrix-bg">
      {/* Decorative grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Profile Photo */}
          <div className="relative group">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-sm overflow-hidden border-2 border-primary/50 animate-pulse-glow">
              <img 
                src={profilePhoto} 
                alt="Kevin Feuerschvenger" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />
          </div>
          
          {/* Hero Text */}
          <div className="text-center lg:text-left">
            <div className="text-muted-foreground text-sm mb-2">
              <span className="text-secondary">$</span> whoami
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              <TypingText 
                text="Kevin Feuerschvenger" 
                speed={80}
                className="text-primary glow-green"
                onComplete={() => setShowSubtitle(true)}
              />
            </h1>
            
            {showSubtitle && (
              <div className="text-lg md:text-2xl text-muted-foreground mb-6">
                <TypingText 
                  text="Software Developer" 
                  speed={60}
                  delay={200}
                  className="text-secondary"
                  onComplete={() => setShowLinks(true)}
                />
              </div>
            )}
            
            {showLinks && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
                <div className="text-sm text-muted-foreground">
                  <span className="text-secondary">📍</span> Puerto Madryn, Argentina
                </div>
                <a 
                  href="https://github.com/kfeuerschvenger" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="terminal-link text-sm"
                >
                  <span className="text-secondary">&gt;</span> github
                </a>
                <a 
                  href="https://linkedin.com/in/kevin-feuerschvenger" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="terminal-link text-sm"
                >
                  <span className="text-secondary">&gt;</span> linkedin
                </a>
              </div>
            )}
            
            <div className="mt-8 text-muted-foreground/50 text-xs">
              <span className="text-terminal-dim">// scroll down to explore</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
