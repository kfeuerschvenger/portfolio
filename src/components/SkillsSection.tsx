import { Folder } from 'lucide-react';
import { ParallaxSection } from './ParallaxSection';

const skillCategories = [
  {
    category: 'frontend',
    skills: ['React', 'TypeScript', 'JavaScript', 'AngularJS', 'HTML5', 'CSS3', 'Vite', 'Tailwind CSS'],
  },
  {
    category: 'backend',
    skills: ['Java (Spring Boot)', 'Node.js (Express)', 'PHP (Laravel)', 'Python', 'Go', 'MyBatis'],
  },
  {
    category: 'databases',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle', 'SQLite', 'Redis'],
  },
  {
    category: 'testing',
    skills: ['JUnit', 'Mockito', 'JaCoCo', 'Vitest', 'Playwright'],
  },
  {
    category: 'devops',
    skills: [
      'Docker',
      'Docker Compose',
      'Kubernetes',
      'OpenShift',
      'Jenkins',
      'GitHub Actions',
      'SonarQube',
      'Nginx',
      'Apache',
    ],
  },
  {
    category: 'version-control',
    skills: ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN'],
  },
  {
    category: 'tools',
    skills: [
      'REST APIs',
      'WebSockets',
      'Swagger/OpenAPI',
      'Postman',
      'Jira',
      'VS Code',
      'IntelliJ IDEA',
      'Maven',
      'NPM',
      'Twilio',
    ],
  },
  {
    category: 'ai',
    skills: [
      'MCP',
      'Agent Orchestration',
      'Agent Harness & Skills',
      'Context Engineering',
      'Spec-Driven Development',
      'Agent Memory (Engram)',
      'AI Code Review',
      'LLM APIs',
    ],
  },
];

export const SkillsSection = () => {
  return (
    <ParallaxSection id="skills" className="py-20 md:py-32" speed={0.4}>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <span className="text-secondary text-sm">$</span>
          <span className="text-muted-foreground text-sm"> tree </span>
          <span className="text-primary glow-green text-sm">~/skills</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.category}
              className="border border-border bg-card/30 p-6 rounded-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Folder className="w-4 h-4 text-secondary" aria-hidden="true" />
                <span className="text-primary font-medium">{category.category}/</span>
              </div>
              
              <div className="space-y-2 pl-6">
                {category.skills.map((skill, index) => (
                  <div 
                    key={skill}
                    className="flex items-center gap-2 text-sm group"
                  >
                    <span className="text-muted-foreground">
                      {index === category.skills.length - 1 ? '└──' : '├──'}
                    </span>
                    <span className="skill-tag group-hover:border-primary group-hover:text-primary transition-colors">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* ASCII art decoration */}
        <div className="mt-12 text-center">
          <pre className="text-primary/20 text-[0.5rem] md:text-xs leading-none inline-block">
{`
    ╔══════════════════════════════════════╗
    ║  SKILLS.EXE LOADED SUCCESSFULLY      ║
    ║  > Ready to compile amazing code     ║
    ╚══════════════════════════════════════╝
`}
          </pre>
        </div>
      </div>
    </ParallaxSection>
  );
};
