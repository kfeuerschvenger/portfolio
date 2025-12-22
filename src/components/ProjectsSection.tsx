import { ParallaxSection } from './ParallaxSection';
import { ExternalLink, GithubIcon } from 'lucide-react';

const projects = [
  {
    name: 'lcdstats',
    description: 'Stats viewer for a Raspberry PI 5 LCD screen',
    language: 'Python',
    languageColor: 'bg-secondary',
    url: 'https://github.com/kfeuerschvenger/lcdstats',
  },
  {
    name: 'BreezyBoard',
    description: 'Streamline your workflow with simple project management boards',
    language: 'TypeScript',
    languageColor: 'bg-accent',
    url: 'https://github.com/kfeuerschvenger/BreezyBoard',
  },
  {
    name: 'perlinsedge',
    description: 'RPG Game in a isometric world map',
    language: 'Java',
    languageColor: 'bg-destructive',
    url: 'https://github.com/kfeuerschvenger/perlinsedge',
  },
  {
    name: 'task-manager-api',
    description: 'RESTful API designed to manage tasks in a collaborative environment',
    language: 'Go',
    languageColor: 'bg-accent',
    url: 'https://github.com/kfeuerschvenger/task-manager-api',
  },
  {
    name: 'programmingrequests',
    description: 'A website where people submit project ideas',
    language: 'TypeScript',
    languageColor: 'bg-accent',
    url: 'https://github.com/kfeuerschvenger/programmingrequests',
  },
  {
    name: 'unitecnica-management',
    description: 'Custom management system for repair workflow using Laravel & MySQL with React client portal',
    language: 'PHP/Laravel',
    languageColor: 'bg-secondary',
    url: 'https://github.com/kfeuerschvenger',
  },
  {
    name: 'thermal-printer-app',
    description: 'Java desktop application for automated receipt printing with thermal printer integration',
    language: 'Java',
    languageColor: 'bg-destructive',
    url: 'https://github.com/kfeuerschvenger',
  },
];

export const ProjectsSection = () => {
  return (
    <ParallaxSection id="projects" className="py-20 md:py-32" speed={0.2}>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <span className="text-secondary text-sm">$</span>
          <span className="text-muted-foreground text-sm"> ls -la </span>
          <span className="text-primary glow-green text-sm">~/projects</span>
        </div>
        
        <div className="border border-border bg-card/30 rounded-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b border-border text-xs text-muted-foreground">
            <div className="col-span-4">NAME</div>
            <div className="col-span-5">DESCRIPTION</div>
            <div className="col-span-2">LANGUAGE</div>
            <div className="col-span-1">LINK</div>
          </div>
          
          {/* Project rows */}
          {projects.map((project, index) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block project-card border-b border-border last:border-b-0 hover:bg-muted/30 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                {/* Name */}
                <div className="md:col-span-4 flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-primary font-medium">{project.name}</span>
                </div>
                
                {/* Description */}
                <div className="md:col-span-5 text-sm text-muted-foreground">
                  {project.description}
                </div>
                
                {/* Language */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${project.languageColor}`} />
                  <span className="text-sm text-muted-foreground">{project.language}</span>
                </div>
                
                {/* Link */}
                <div className="md:col-span-1 flex justify-end">
                  <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="https://github.com/kfeuerschvenger?tab=repositories" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-secondary">$</span> view all repositories
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </ParallaxSection>
  );
};
