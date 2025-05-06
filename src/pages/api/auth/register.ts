import type { APIRoute } from "astro";
import { z } from "zod";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

const registerSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password } = registerSchema.parse(body);

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error:
            error.message === "User already registered"
              ? "Użytkownik o podanym adresie email już istnieje"
              : error.message,
        }),
        { status: 400 }
      );
    }

    // Automatyczne logowanie po rejestracji
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return new Response(JSON.stringify({ error: "Rejestracja udana, ale wystąpił błąd podczas logowania" }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({
        user: signInData.user,
        message: "Rejestracja i logowanie zakończone sukcesem",
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors[0].message }), { status: 400 });
    }

    return new Response(JSON.stringify({ error: "Wystąpił nieoczekiwany błąd" }), { status: 500 });
  }
};
