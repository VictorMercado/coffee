import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Protect /admin routes (except login page)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      // If already authenticated, redirect to admin dashboard
      if (session?.user?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/menu-items", request.url))
      }
      return NextResponse.next()
    }

    // For all other admin routes, check authentication
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
