import { NextResponse } from "next/server";

const MAILERLITE_ENDPOINT = "https://connect.mailerlite.com/api/subscribers";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_EMAIL_LENGTH = 254;

export async function POST(request: Request) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!apiKey || !groupId) {
    console.error("MailerLite env vars missing");
    return NextResponse.json(
      { error: "server_misconfigured" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const rawEmail =
    body && typeof body === "object" && "email" in body
      ? (body as { email: unknown }).email
      : null;
  const honeypot =
    body && typeof body === "object" && "company" in body
      ? (body as { company: unknown }).company
      : null;

  // Honeypot: bots fill hidden fields. Silently accept, do nothing.
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof rawEmail !== "string") {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const email = rawEmail.trim().toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(MAILERLITE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, groups: [groupId] }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("MailerLite fetch failed", err);
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }

  // 200 = existing, 201 = created. Both are success from the user's POV.
  if (upstream.ok) {
    return NextResponse.json({ ok: true });
  }

  if (upstream.status === 429) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const detail = await upstream.text().catch(() => "");
  console.error("MailerLite error", upstream.status, detail);
  return NextResponse.json({ error: "upstream_error" }, { status: 502 });
}
