import { ParallaxSection } from './ParallaxSection';
import { TerminalWindow } from './TerminalWindow';

export const AboutSection = () => {
  return (
    <ParallaxSection id="about" className="py-20 md:py-32" speed={0.3}>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <span className="text-secondary text-sm">$</span>
          <span className="text-muted-foreground text-sm"> cat </span>
          <span className="text-primary glow-green text-sm">about.txt</span>
        </div>
        
        <TerminalWindow title="about.txt - vim">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground/50 text-right w-8 select-none">1</span>
              <div className="text-foreground">
                <span className="text-accent">/**</span>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground/50 text-right w-8 select-none">2</span>
              <div className="text-foreground">
                <span className="text-accent"> * </span>
                <span className="text-primary">Full Stack Developer</span>
                <span className="text-muted-foreground"> with 7+ years of experience</span>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground/50 text-right w-8 select-none">3</span>
              <div className="text-foreground">
                <span className="text-accent"> * </span>
                <span className="text-muted-foreground">Based in </span>
                <span className="text-secondary">Puerto Madryn, Argentina</span>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground/50 text-right w-8 select-none">4</span>
              <div className="text-muted-foreground leading-relaxed max-w-2xl">
                <span className="text-accent"> * </span                >
                Specialized in <span className="text-primary">React</span> and <span className="text-primary">Node.js</span>,
                with solid background in <span className="text-primary">Java (Spring Boot)</span>,
                <span className="text-primary">PHP (Laravel)</span>, and modern web technologies.
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground/50 text-right w-8 select-none">5</span>
              <div className="text-muted-foreground leading-relaxed max-w-2xl">
                <span className="text-accent"> * </span>
                Currently modernizing legacy Spring services from Java 6/8 to Java 25,
                refactoring codebases, and implementing automated tests to raise code quality.
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground/50 text-right w-8 select-none">6</span>
              <div className="text-muted-foreground leading-relaxed max-w-2xl">
                <span className="text-accent"> * </span>
                Co-founder of <span className="text-primary">Unitecnica</span> - built custom management systems,
                client portals, and automated workflows. Previous experience at <span className="text-primary">Sur Software</span>
                with ETL pipelines and ERP implementations.
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground/50 text-right w-8 select-none">7</span>
              <div className="text-muted-foreground leading-relaxed max-w-2xl">
                <span className="text-accent"> * </span>
                Passionate about clean code, automated testing, and continuous improvement.
                Fluent in Spanish, intermediate English, currently pursuing certification.
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground/50 text-right w-8 select-none">7</span>
              <div className="text-foreground">
                <span className="text-accent"> */</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-primary">:q</span>
              <span>to exit</span>
              <span className="text-primary ml-4">:wq</span>
              <span>to save and exit</span>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </ParallaxSection>
  );
};
