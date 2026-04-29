import { loginWithCredentials } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
import { PasswordInput } from "@/app/components/PasswordInput";
import Link from "next/link";

export function CredentialsForm({ error, callbackUrl }: { error?: string; callbackUrl?: string }) {
  return (
    <form action={loginWithCredentials} className="connexion-form">
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      {error && <p className="form-error">{error}</p>}
      <div className="field-group">
        <label className="field-label" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="field-input"
        />
      </div>
      <PasswordInput
        id="password"
        name="password"
        label="Mot de passe"
        required
        autoComplete="current-password"
      />
      <SubmitButton label="Se connecter" pendingLabel="Connexion…" />
      <p className="connexion-switch">
        Pas encore de compte ?{" "}
        <Link href="/inscription">Créer un compte</Link>
      </p>
    </form>
  );
}
