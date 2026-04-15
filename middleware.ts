import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  // Public demo: anyone can open /analyze?demo=1 (static sample only, no account).
  const isAnalyzeDemo = path === '/analyze' && request.nextUrl.searchParams.get('demo') === '1';
  const isAuth = path.startsWith('/login') || path.startsWith('/signup');
  const isApp = ['/dashboard', '/analyze', '/analysis', '/settings'].some((p) => path.startsWith(p));
  if (!user && isApp && !isAnalyzeDemo) return NextResponse.redirect(new URL('/login', request.url));
  if (user && isAuth) return NextResponse.redirect(new URL('/dashboard', request.url));
  return supabaseResponse;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'] };
