import Link from "next/link";
import { HeroImage } from "./HeroImage";

const Footer = () => {
  return (
    <footer className="w-full bg-primary px-6 py-16 text-white sm:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <HeroImage mode="footer" />

          <nav className="flex flex-col gap-3 text-body font-bold">
            <Link href="/">Home</Link>
            <Link href="#about">About</Link>
            <Link href="#how-to-use">How to use</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>

        <div className="mt-16 border-t border-white pt-8 text-center text-body font-bold">
          © 2026 Behindlog. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
