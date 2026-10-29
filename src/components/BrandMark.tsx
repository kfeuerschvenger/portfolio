// The kfeuerschvenger mark on its native 32 pixel grid: a pixel K, an amber prompt underscore and
// two rows of cyan waves. It is decorative, so it is hidden from assistive technology.
// Rendered at 32 px every grid cell is exactly one device pixel, which keeps the edges crisp.
const STEM = 'M2 2h3v1h-3zM15 2h3v1h-3zM2 3h3v1h-3zM14 3h3v1h-3zM2 4h3v1h-3zM13 4h3v1h-3zM2 5h3v1h-3zM12 5h3v1h-3zM2 6h3v1h-3zM11 6h3v1h-3zM2 7h3v1h-3zM10 7h3v1h-3zM2 8h3v1h-3zM9 8h3v1h-3zM2 9h3v1h-3zM8 9h3v1h-3zM2 10h3v1h-3zM7 10h3v1h-3zM2 11h3v1h-3zM6 11h3v1h-3zM2 12h6v1h-6zM2 13h3v1h-3zM6 13h3v1h-3zM2 14h3v1h-3zM7 14h3v1h-3zM2 15h3v1h-3zM8 15h3v1h-3zM2 16h3v1h-3zM9 16h3v1h-3zM2 17h3v1h-3zM10 17h3v1h-3zM2 18h3v1h-3zM11 18h3v1h-3zM2 19h3v1h-3zM12 19h3v1h-3zM2 20h3v1h-3zM13 20h3v1h-3zM2 21h3v1h-3zM14 21h3v1h-3zM2 22h3v1h-3zM15 22h3v1h-3z';
const PROMPT = 'M21 21h8v2h-8z';
const WAVES = 'M2 26h4v1h-4zM10 26h4v1h-4zM18 26h4v1h-4zM2 27h4v1h-4zM10 27h4v1h-4zM18 27h4v1h-4zM6 28h4v1h-4zM14 28h4v1h-4zM6 29h4v1h-4zM14 29h4v1h-4z';

type BrandMarkProps = { className?: string };

export function BrandMark({ className = 'h-8 w-8 shrink-0' }: BrandMarkProps) {
  return (
    <svg
      data-testid="brand-mark"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={className}
    >
      <path d={STEM} className="fill-primary" />
      <path d={PROMPT} className="fill-secondary" />
      <path d={WAVES} className="fill-accent" />
    </svg>
  );
}
