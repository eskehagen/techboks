import { Link } from "@tanstack/react-router";
// 108 px-udgave (3x af de 36 px, logoet vises i). Originalen på 816 px og
// 460 KB blev hentet på hver side. Laves af `npm run images`.
import logoMark from "@/assets/logo-mark-108.png";

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
