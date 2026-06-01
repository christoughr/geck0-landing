import Navbar from "./Navbar";
import { Footer } from "./CtaFooter";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16 min-h-screen overflow-x-clip max-w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
