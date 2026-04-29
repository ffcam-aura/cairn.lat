"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateSection } from "@/app/actions";
import type { SectionConfig } from "./sections";

type Props = {
  slug: string;
  section: SectionConfig;
  data: Record<string, string>;
  filled: boolean;
};

export function SectionForm({ slug, section, data, filled }: Props) {
  const router = useRouter();
  const boundAction = updateSection.bind(null, slug);
  const [state, formAction, pending] = useActionState(boundAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const isDone = filled || state?.ok;

  return (
    <section className={`debrief-section${isDone ? " debrief-section--done" : ""}`}>
      <div className="section-head">
        <span className="section-num">{section.number}</span>
        <h2 className="section-title-app">{section.title}</h2>
        {isDone && (
          <span className="section-badge" aria-label="Section renseignée">
            ✓
          </span>
        )}
      </div>
      <p className="section-helper">{section.helper}</p>
      <form action={formAction} className="section-form">
        {section.questions.map((q) => (
          <div key={q.key} className="field-group">
            <label
              htmlFor={`${section.key}-${q.key}`}
              className="field-label"
            >
              {q.label}
            </label>
            <textarea
              id={`${section.key}-${q.key}`}
              name={q.key}
              defaultValue={data[q.key] ?? ""}
              rows={q.rows}
              className="field-textarea"
              placeholder={q.placeholder}
            />
          </div>
        ))}
        <div className="section-footer">
          <button
            type="submit"
            disabled={pending}
            className={`btn-save${state?.ok ? " btn-save--done" : ""}`}
          >
            {pending
              ? "Enregistrement…"
              : state?.ok
                ? "Enregistré ✓"
                : "Enregistrer"}
          </button>
        </div>
      </form>
    </section>
  );
}
