import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // PKCE/code-based confirmation
  const code = searchParams.get("code");

  // Token-hash based confirmation
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // ----------------------------------------
  // 1. Handle code-based authentication
  // ----------------------------------------
  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      redirect(`${origin}${next}`);
    }
  }

  // ----------------------------------------
  // 2. Handle email confirmation
  // ----------------------------------------
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "email",
      token_hash,
    });

    if (!error) {
      redirect(`${origin}/login?confirmed=true`);
    }
  }

  // ----------------------------------------
  // 3. Authentication failed
  // ----------------------------------------
  redirect(`${origin}/login?error=auth`);
}