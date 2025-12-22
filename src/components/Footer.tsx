export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            <span className="text-secondary">$</span> © {currentYear} Kevin Feuerschvenger
          </div>
          
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <span className="text-primary">React</span>
            <span>+</span>
            <span className="text-accent">TypeScript</span>
            <span>+</span>
            <span className="text-secondary">TailwindCSS</span>
          </div>
          
          <div className="text-muted-foreground/50">
            <span className="cursor-blink text-primary">▌</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
