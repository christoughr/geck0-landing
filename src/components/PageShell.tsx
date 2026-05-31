import Navbar from "./Navbar";
import { Footer } from "./CtaFooter";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-purple-400 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="pt-16 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
