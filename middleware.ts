import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED = ["/mes-debriefs", "/nouveau"];
const AUTH_ONLY = ["/connexion", "/inscription"];

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user?.id;
  const path = req.nextUrl.pathname;

  if (!isLoggedIn && PROTECTED.some((p) => path.startsWith(p))) {
    const url = new URL("/connexion", req.nextUrl);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && AUTH_ONLY.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/mes-debriefs", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)" ],
};
