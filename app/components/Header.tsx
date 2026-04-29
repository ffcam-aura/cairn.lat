import Link from "next/link";
import { auth, signOut } from "@/auth";
import { AuthNavLink } from "./AuthNavLink";

export async function Header() {
  const session = await auth();

  return (
    <header className="top">
      <Link className="brand" href="/" aria-label="Cairn, accueil">
        <svg
          className="brand-mark"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 19 H20"
            stroke="#2E4A3A"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M6.5 19 C6.5 16.2 9 14.5 12 14.5 C15 14.5 17.5 16.2 17.5 19"
            stroke="#2E4A3A"
            strokeWidth="1.3"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 14.8 C8.5 12.8 10 11.3 12 11.3 C14 11.3 15.5 12.8 15.5 14.8"
            stroke="#2E4A3A"
            strokeWidth="1.3"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M10.3 11.5 C10.3 10 11 9 12 9 C13 9 13.7 10 13.7 11.5"
            stroke="#A84912"
            strokeWidth="1.3"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
        <span className="brand-name">
          Cairn<span className="brand-dot" />
          <span className="brand-tld">cairn.lat</span>
        </span>
      </Link>

      <nav className="header-nav">
        {session?.user ? (
          <>
            <Link href="/mes-debriefs" className="header-nav-link">
              Mes débriefs
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/connexion" });
              }}
            >
              <button
                type="submit"
                className="header-nav-btn"
                title={`Déconnecter ${session.user.name?.split(" ")[0] ?? "Compte"}`}
                aria-label="Se déconnecter"
              >
                {session.user.name?.split(" ")[0] ?? "Compte"}
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <AuthNavLink />
        )}
      </nav>
    </header>
  );
}
