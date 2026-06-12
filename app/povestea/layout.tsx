import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Povestea",
  robots: { index: false },
};

export default function PovesteaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
