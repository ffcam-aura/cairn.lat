"use client";

import { useState } from "react";

type Props = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
};

export function PasswordInput({ id, name, label, hint, required, minLength, autoComplete }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="password-wrapper">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className="field-input"
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {show ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}
