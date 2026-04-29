"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { inviteByEmail } from "@/app/actions";

export function InviteButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const action = inviteByEmail.bind(null, slug);
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  // Reset form after success
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <div className="invite-root" ref={panelRef}>
      <button
        type="button"
        className={`btn-invite${compact ? " btn-invite--compact" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Inviter un contributeur"
        title="Inviter"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/>
          <line x1="16" y1="11" x2="22" y2="11"/>
        </svg>
        {!compact && "Inviter"}
      </button>

      {open && (
        <>
          <div className="invite-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="invite-panel">
            <p className="invite-panel-label">Inviter par email</p>
            <form ref={formRef} action={formAction} className="invite-form">
              <input
                ref={inputRef}
                name="email"
                type="email"
                required
                placeholder="prenom@exemple.com"
                className="field-input invite-input"
              />
              <button type="submit" disabled={isPending} className="btn-save">
                {isPending ? "…" : "Envoyer"}
              </button>
            </form>
            {state && (
              <p className={`invite-feedback${state.ok ? " invite-feedback--ok" : " invite-feedback--err"}`}>
                {state.message}
              </p>
            )}
            <p className="invite-hint">
              Un email sera envoyé avec un lien d'invitation.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
