import { defineMiddleware } from "astro:middleware";

// Lista ścieżek publicznych (dostępnych bez logowania)
const PUBLIC_PATHS = ["/login", "/register"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies } = context;
  const pathname = new URL(url).pathname;

  // Jeśli użytkownik próbuje dostać się do strony logowania/rejestracji będąc zalogowanym,
  // przekieruj go na dashboard
  if (PUBLIC_PATHS.includes(pathname)) {
    const session = cookies.get("session");
    if (session?.value) {
      return context.redirect("/dashboard");
    }
    return next();
  }

  // Dla wszystkich innych ścieżek sprawdź, czy użytkownik jest zalogowany
  const session = cookies.get("session");
  if (!session?.value) {
    return context.redirect("/login");
  }

  return next();
});
