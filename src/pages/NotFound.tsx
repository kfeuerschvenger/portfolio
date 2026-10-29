import { Link, useLocation } from 'react-router';
import { useEffect } from 'react';
import { TerminalWindow } from '../components/TerminalWindow';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="scanlines flex min-h-screen items-center justify-center bg-background px-4">
      <main className="w-full max-w-xl">
        <TerminalWindow title="bash - 404">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-secondary">$</span>
              <span className="text-muted-foreground"> cd </span>
              <span className="text-primary glow-green break-all">{location.pathname}</span>
            </div>
            <h1 className="text-destructive font-bold">bash: cd: No such file or directory (404)</h1>
            <div className="pt-4">
              <span className="text-secondary">$</span>
              <span className="text-muted-foreground"> cd </span>
              <Link to="/" className="terminal-link">~</Link>
            </div>
          </div>
        </TerminalWindow>
      </main>
    </div>
  );
};

export default NotFound;
