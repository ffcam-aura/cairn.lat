"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerUser } from "@/app/actions";
import { PasswordInput } from "@/app/components/PasswordInput";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Création…" : "Créer mon compte"}
    </button>
  );
}

export function RegisterForm() {
  const [state, action] = useActionState(registerUser, null);

  return (
    <form action={action} className="connexion-form">
      {state?.error && <p className="form-error">{state.error}</p>}
      <div className="field-group">
        <label className="field-label" htmlFor="name">Prénom (optionnel)</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="given-name"
          className="field-input"
        />
      </div>
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
        hint="8 caractères minimum"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <SubmitButton />
      <p className="connexion-switch">
        Déjà un compte ?{" "}
        <Link href="/connexion">Se connecter</Link>
      </p>
    </form>
  );
}
