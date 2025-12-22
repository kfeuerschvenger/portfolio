import { useState, useEffect } from 'react';

const navItems = [
  { label: 'home', href: '#home' },
  { label: 'about', href: '#about' },
  { label: 'projects', href: '#projects' },
  { label: 'skills', href: '#skills' },
  { label: 'contact', href: '#contact' },
];

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = navItems.map(item => item.href.slice(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : ''
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="#home" className="text-primary glow-green font-bold text-lg">
            ~/kfeuerschvenger
          </a>
          
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm transition-all duration-200 hover:text-primary ${
                  activeSection === item.href.slice(1)
                    ? 'text-primary glow-green'
                    : 'text-muted-foreground'
                }`}
              >
                <span className="text-secondary">./</span>{item.label}
              </a>
            ))}
          </div>
          
          <div className="md:hidden text-primary">
            <span className="text-secondary">$</span> menu
          </div>
        </div>
      </div>
    </nav>
  );
};
