/// <reference types="astro/client" />

import type { SupabaseClient } from "./db/supabase.client";

interface ContextUser {
  id: string;
  email: string | null;
}

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      user: ContextUser;
    }
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_KEY: string;
  readonly OPENROUTER_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
