"use client";

import { useState, useTransition } from "react";
import { deleteDebrief } from "@/app/actions";

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  );
}

type Props = { slug: string; compact?: boolean };

export function DeleteDebriefButton({ slug, compact = false }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(() => deleteDebrief(slug));
  }

  if (compact) {
    if (!confirming) {
      return (
        <button
          type="button"
          className="btn-trash"
          onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
          title="Supprimer ce débrief"
          aria-label="Supprimer ce débrief"
        >
          <TrashIcon />
        </button>
      );
    }
    return (
      <div className="trash-confirm" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn-trash-confirm"
          disabled={isPending}
          onClick={handleDelete}
        >
          {isPending ? "…" : "Supprimer"}
        </button>
        <button
          type="button"
          className="btn-trash-cancel"
          onClick={() => setConfirming(false)}
        >
          Annuler
        </button>
      </div>
    );
  }

  // Version pleine — page débrief
  if (!confirming) {
    return (
      <button
        type="button"
        className="btn-delete-full"
        onClick={() => setConfirming(true)}
      >
        <TrashIcon />
        Supprimer ce débrief
      </button>
    );
  }

  return (
    <div className="delete-confirm">
      <p className="delete-confirm-text">
        Irréversible — toutes les données seront supprimées définitivement.
      </p>
      <div className="delete-confirm-actions">
        <button
          type="button"
          className="btn-delete-confirm"
          disabled={isPending}
          onClick={handleDelete}
        >
          {isPending ? "Suppression…" : "Oui, supprimer"}
        </button>
        <button
          type="button"
          className="btn-delete-cancel"
          onClick={() => setConfirming(false)}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
