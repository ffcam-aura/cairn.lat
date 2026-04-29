"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthNavLink() {
  const pathname = usePathname();

  if (pathname === "/connexion") {
    return (
      <Link href="/inscription" className="header-nav-link">
        S&apos;inscrire
      </Link>
    );
  }

  if (pathname === "/inscription") {
    return (
      <Link href="/connexion" className="header-nav-link">
        Se connecter
      </Link>
    );
  }

  return (
    <Link href="/connexion" className="header-nav-link">
      Se connecter
    </Link>
  );
}
