"use client";

import { useEffect, useRef, useState } from "react";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const AUTO_RESET_MS = 5000;

type Status = "idle" | "pending" | "invalid" | "error";

type Props = {
  submitLabel: string;
  successMessage: string;
  placeholder?: string;
  fullWidth?: boolean;
};

export default function EmailCapture({
  submitLabel,
  successMessage,
  placeholder = "prénom@exemple.fr",
  fullWidth = false,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const resetTimerRef = useRef<number | null>(null);

  function clearResetTimer() {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }

  function reset() {
    clearResetTimer();
    setSubmitted(false);
    setStatus("idle");
    formRef.current?.reset();
  }

  useEffect(() => clearResetTimer, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement | null;
    const honeypotInput = form.elements.namedItem(
      "company",
    ) as HTMLInputElement | null;
    const email = emailInput?.value.trim() ?? "";
    const honeypot = honeypotInput?.value ?? "";

    if (!email || !EMAIL_RE.test(email)) {
      setStatus("invalid");
      emailInput?.focus();
      window.setTimeout(() => setStatus("idle"), 1400);
      return;
    }

    setStatus("pending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: honeypot }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("idle");
      setSubmitted(true);
      clearResetTimer();
      resetTimerRef.current = window.setTimeout(reset, AUTO_RESET_MS);
    } catch {
      setStatus("error");
    }
  }

  const pending = status === "pending";

  return (
    <>
      <form
        ref={formRef}
        className={`capture${submitted ? " hidden" : ""}${
          status === "invalid" ? " invalid" : ""
        }`}
        onSubmit={handleSubmit}
        noValidate
        style={fullWidth ? { maxWidth: "none" } : undefined}
      >
        <input
          type="email"
          name="email"
          placeholder={placeholder}
          aria-label="Votre adresse email"
          disabled={pending}
          autoComplete="email"
        />
        {/* honeypot: hidden from humans, filled by some bots */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-10000px",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <button type="submit" disabled={pending}>
          {pending ? "Envoi…" : submitLabel}
        </button>
      </form>
      <div
        className={`capture-success${submitted ? " show" : ""}`}
        role="status"
        aria-live="polite"
        style={fullWidth ? { marginTop: "10px" } : undefined}
      >
        <span>{successMessage}</span>
        <button
          type="button"
          className="capture-close"
          aria-label="Fermer"
          onClick={reset}
        >
          ×
        </button>
      </div>
      {status === "error" && !submitted && (
        <p
          className="capture-note"
          role="alert"
          style={{ color: "var(--burnt)" }}
        >
          Un souci côté serveur. Réessayez dans un instant, ou écrivez à{" "}
          <a href="mailto:bonjour@cairn.lat">bonjour@cairn.lat</a>.
        </p>
      )}
    </>
  );
}
