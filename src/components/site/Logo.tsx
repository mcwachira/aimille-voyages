
import { cn } from "@/lib/utils";

export function Logo({ light }: { light?: boolean }) {
    return (
        <span
            className={cn(
                "flex flex-col leading-none",
                light ? "text-ivory" : "text-primary",
            )}
        >
      <span className="font-serif text-2xl tracking-[0.18em]">
        AIMILLE
      </span>
      <span className="eyebrow mt-1 text-[0.55rem] text-gold">
        Voyages
      </span>
    </span>
    );
}
