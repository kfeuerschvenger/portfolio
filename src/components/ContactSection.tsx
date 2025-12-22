import { ParallaxSection } from './ParallaxSection';
import { TerminalWindow } from './TerminalWindow';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

export const ContactSection = () => {
  return (
    <ParallaxSection id="contact" className="py-20 md:py-32" speed={0.2}>
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <span className="text-secondary text-sm">$</span>
          <span className="text-muted-foreground text-sm"> ./contact </span>
          <span className="text-primary glow-green text-sm">--help</span>
        </div>
        
        <TerminalWindow title="contact.sh">
          <div className="space-y-6">
            <div>
              <div className="text-muted-foreground text-sm mb-4">
                <span className="text-accent"># </span>
                Let's connect and build something amazing together
              </div>
            </div>
            
            <div className="space-y-4">
              <a 
                href="https://github.com/kfeuerschvenger"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 border border-border hover:border-primary hover:bg-muted/30 transition-all duration-300 rounded-sm group"
              >
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <div className="text-primary text-sm">github</div>
                  <div className="text-muted-foreground text-xs">@kfeuerschvenger</div>
                </div>
              </a>
              
              <a 
                href="https://linkedin.com/in/kevin-feuerschvenger"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 border border-border hover:border-primary hover:bg-muted/30 transition-all duration-300 rounded-sm group"
              >
                <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <div className="text-primary text-sm">linkedin</div>
                  <div className="text-muted-foreground text-xs">in/kevin-feuerschvenger</div>
                </div>
              </a>
              
              <a 
                href="mailto:kfeuerschvenger@gmail.com"
                className="flex items-center gap-4 p-3 border border-border hover:border-primary hover:bg-muted/30 transition-all duration-300 rounded-sm group"
              >
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <div className="text-primary text-sm">email</div>
                  <div className="text-muted-foreground text-xs">Get in touch</div>
                </div>
              </a>
              
              <div className="flex items-center gap-4 p-3 border border-border/50 rounded-sm">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground text-sm">location</div>
                  <div className="text-muted-foreground text-xs">Puerto Madryn, Chubut, Argentina</div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground/50">
                <span className="text-secondary">$</span> echo "Thanks for visiting!"
              </div>
              <div className="text-primary text-sm mt-1">Thanks for visiting!</div>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </ParallaxSection>
  );
};
