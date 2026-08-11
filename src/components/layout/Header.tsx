"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  email: string;
}

export function Header({ email }: HeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <h1 className="text-lg font-semibold text-white sm:text-xl">TaskFlow</h1>
          <p className="text-xs text-slate-400 sm:text-sm">{email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
