// app/template.tsx
import type { ReactNode } from "react";

type TemplateProps = Readonly<{
  children: ReactNode;
}>;

export default function Template({ children }: TemplateProps) {
  return (
    <div className="min-h-svh w-full">
      <div className="min-h-svh w-full animate-[luxRouteIn_720ms_var(--ease-luxury)_both] will-change-[opacity,transform]">
        {children}
      </div>
    </div>
  );
}