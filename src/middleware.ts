import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function createSupabaseEdgeClient(req: NextRequest, res: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        res.cookies.set({ name, value: "", ...options });
      },
    },
  });
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseEdgeClient(req, res);

  // Session refresh
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  const path = req.nextUrl.pathname;

  // Public paths
  const isPublic =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/api/auth/callback") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    path === "/robots.txt" ||
    path === "/sitemap.xml";

  if (isPublic) return res;

  // Protected paths (team required)
  const isProtected = path.startsWith("/teams") || path.startsWith("/api/posts") || path.startsWith("/api/follows");

  if (!isProtected) return res;

  // Must be logged in - redirect to home if not authenticated
  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Must be provisioned (profiles has team_id)
  const { data: profile } = await supabase.from("profiles").select("team_id").eq("user_id", user.id).maybeSingle();

  // Requirement: provision edilmemişler sadece home görsün
  if (!profile?.team_id) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
