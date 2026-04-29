import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Header } from "@/app/components/Header";
import { CredentialsForm } from "./CredentialsForm";

export const metadata = {
  title: "Connexion — Cairn",
};

type Props = {
  searchParams: Promise<{ error?: string; registered?: string; callbackUrl?: string }>;
};

export default async function ConnexionPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user?.id) redirect("/mes-debriefs");

  const params = await searchParams;
  const registered = params.registered === "1";
  const callbackUrl = params.callbackUrl?.startsWith("/") ? params.callbackUrl : undefined;

  const ERROR_MESSAGES: Record<string, string> = {
    OAuthAccountNotLinked:
      "Cet email est déjà associé à un compte Cairn. Connectez-vous avec votre email et votre mot de passe.",
    OAuthCallbackError:
      "La connexion avec Google a échoué. Réessayez ou utilisez votre email et mot de passe.",
    CredentialsSignin: "Email ou mot de passe incorrect.",
  };
  const rawError = params.error;
  const error = rawError
    ? (ERROR_MESSAGES[rawError] ?? decodeURIComponent(rawError))
    : undefined;

  return (
    <div className="wrap">
      <Header />
      <main className="connexion-main">
        <div className="connexion-card">
          <div className="connexion-header">
            <p className="eyebrow">Accès</p>
            <h1 className="section-title">Se connecter</h1>
            <p className="body-text">
              Retrouvez vos débriefs, rejoignez ceux de votre groupe, gardez
              une trace durable de vos sorties.
            </p>
          </div>

          {registered && (
            <p className="form-success">
              Compte créé avec succès. Connectez-vous.
            </p>
          )}

          <CredentialsForm error={error} callbackUrl={callbackUrl} />

          <div className="auth-divider">
            <span>ou</span>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/mes-debriefs" });
            }}
          >
            <button type="submit" className="btn-google">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
              </svg>
              Continuer avec Google
            </button>
          </form>

          <p className="connexion-note">
            Votre email n&apos;est utilisé qu&apos;pour vous identifier.
            Aucune donnée n&apos;est partagée.
          </p>
        </div>
      </main>
    </div>
  );
}
