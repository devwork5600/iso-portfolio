import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable — devwork5600",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm tracking-widest text-[#d8b18d] uppercase">Erreur 404</p>
      <h1 className="text-3xl font-semibold sm:text-4xl">Cette pièce n&apos;existe pas</h1>
      <p className="max-w-md text-foreground/70">
        La page que tu cherches n&apos;a pas été trouvée. Retourne explorer le portfolio.
      </p>
      <Link
        href="/"
        className="rounded-md border-2 border-[#d8b18d] px-6 py-3 text-[#d8b18d] transition-colors duration-300 hover:bg-[#d8b18d] hover:text-black"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
