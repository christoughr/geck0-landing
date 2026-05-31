import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
}

export default function Logo({ className = "text-xl", href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center font-bold ${className}`}>
      <span className="text-white">geck</span>
      <span className="text-purple-400">0</span>
    </Link>
  );
}
