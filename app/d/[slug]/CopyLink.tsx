"use client";

import { useState } from "react";

type Props = {
  url: string;
  label: string;
  className?: string;
};

export function CopyLink({ url, label, className = "btn-copy" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button onClick={handleCopy} className={className}>
      {copied ? "Lien copié ✓" : label}
    </button>
  );
}
