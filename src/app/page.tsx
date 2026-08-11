import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, LayoutList, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <span className="text-xl font-bold text-white">TaskFlow</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-indigo-300">
            Task management made simple
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Create, update, and track tasks in real time
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            TaskFlow helps you stay organized with secure authentication,
            full task CRUD, live updates, and a responsive interface for
            desktop and mobile.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Create free account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 px-6 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<LayoutList className="h-5 w-5 text-indigo-300" />}
            title="Full CRUD"
            description="Create, edit, filter, and delete tasks with status and priority."
          />
          <FeatureCard
            icon={<CheckCircle2 className="h-5 w-5 text-indigo-300" />}
            title="Secure auth"
            description="Each user only sees their own tasks with row-level security."
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5 text-indigo-300" />}
            title="Live updates"
            description="Changes sync instantly across tabs using Supabase Realtime."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-3 inline-flex rounded-lg bg-indigo-500/10 p-2">{icon}</div>
      <h2 className="font-medium text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}
