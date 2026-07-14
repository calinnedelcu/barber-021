"use client";

interface DemoOption {
  id: string;
  label: string;
  shortLabel: string;
  swatch?: [string, string];
  href?: string;
}

interface DemoPackageSwitcherProps {
  label: string;
  active: string;
  options: DemoOption[];
  onChange?: (id: string) => void;
  align?: "center" | "left";
}

export function DemoPackageSwitcher({
  label,
  active,
  options,
  onChange,
  align = "center",
}: DemoPackageSwitcherProps) {
  const shellPosition =
    align === "left"
      ? "left-3 sm:left-4"
      : "left-1/2 -translate-x-1/2";

  return (
    <nav
      aria-label={`${label}: alege varianta`}
      className={`fixed z-[200] flex max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-[8px] border border-white/15 bg-[#0b0b0d]/90 p-1.5 text-white shadow-[0_12px_36px_rgb(0_0_0/.38)] backdrop-blur-xl ${shellPosition}`}
      style={{ bottom: "max(.75rem, env(safe-area-inset-bottom))" }}
    >
      <span className="hidden whitespace-nowrap px-2 text-[0.62rem] font-semibold uppercase text-white/48 sm:block">
        {label}
      </span>
      <div role="group" className="flex items-center gap-1">
        {options.map((option) => {
          const selected = option.id === active;
          const content = (
            <>
              {option.swatch && (
                <span
                  aria-hidden
                  className="h-5 w-5 shrink-0 rounded-full border border-white/20"
                  style={{
                    background: `linear-gradient(135deg, ${option.swatch[0]} 50%, ${option.swatch[1]} 50%)`,
                  }}
                />
              )}
              <span className="sm:hidden">{option.shortLabel}</span>
              <span className="hidden sm:inline">{option.label}</span>
            </>
          );
          const className = `flex min-h-9 items-center justify-center gap-1.5 rounded-[5px] px-2.5 text-xs font-bold transition-colors ${
            selected
              ? "bg-[#ff4533] text-[#09090a]"
              : "text-white/62 hover:bg-white/8 hover:text-white"
          }`;

          if (option.href) {
            return (
              <a
                key={option.id}
                href={option.href}
                aria-current={selected ? "page" : undefined}
                title={option.label}
                className={className}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              title={option.label}
              className={className}
              onClick={() => onChange?.(option.id)}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
