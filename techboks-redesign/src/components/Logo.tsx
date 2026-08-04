import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/logo-mark-c.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex shrink-0 items-center gap-2.5 ${className}`}>
      <img
        src={logoMark}
        alt=""
        width={40}
        height={40}
        className="h-9 w-9"
        aria-hidden="true"
      />
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        Tech<span className="text-muted-foreground">Boks</span>
      </span>
    </Link>
  );
}
