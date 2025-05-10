import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    await supabase.auth.signOut();
    return new Response(null, { status: 200 });
  } catch {
    return new Response(JSON.stringify({ message: "Failed to logout" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
