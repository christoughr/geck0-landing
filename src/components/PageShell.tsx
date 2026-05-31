import Navbar from "./Navbar";
import { Footer } from "./CtaFooter";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
