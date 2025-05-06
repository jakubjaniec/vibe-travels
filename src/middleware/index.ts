import type { User } from "@supabase/supabase-js";
import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";

// Lista ścieżek publicznych (dostępnych bez logowania)
const PUBLIC_PATHS = ["/login", "/register"];

// Typ dla użytkownika w kontekście
interface ContextUser {
  id: string;
  email: string | null;
}

// Konwersja użytkownika Supabase na użytkownika kontekstu
function mapUserToContext(user: User): ContextUser {
  return {
    id: user.id,
    email: user.email ?? null,
  };
}

// Eksport middleware jako onRequest
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = new URL(url).pathname;

  // Inicjalizacja Supabase z kontekstem żądania
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: context.request.headers,
  });

  // Dodaj instancję Supabase do locals
  context.locals.supabase = supabase;

  // Dla endpointów API nie sprawdzamy sesji
  if (pathname.startsWith("/api/")) {
    return next();
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Jeśli użytkownik próbuje dostać się do strony logowania/rejestracji będąc zalogowanym,
  // przekieruj go na dashboard
  if (PUBLIC_PATHS.includes(pathname)) {
    if (session) {
      return redirect("/dashboard");
    }
    return next();
  }

  // Dla wszystkich innych ścieżek sprawdź, czy użytkownik jest zalogowany
  if (!session) {
    return redirect("/login");
  }

  // Dodaj informacje o użytkowniku do kontekstu
  context.locals.user = mapUserToContext(session.user);

  return next();
});
