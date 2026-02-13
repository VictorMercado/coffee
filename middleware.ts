import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  // Protect /admin routes (except login page)
  if (nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (nextUrl.pathname === "/admin/login") {
      // If already authenticated as ADMIN, redirect to dashboard
      if (isLoggedIn && user?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/menu-items", nextUrl));
      }
      return NextResponse.next();
    }

    // For all other admin routes, check authentication and role
    if (!isLoggedIn || user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};

