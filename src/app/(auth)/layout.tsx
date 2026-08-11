import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <Link href="/" className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-white">
            TaskFlow
          </span>
          <p className="mt-1 text-sm text-slate-400">
            Organize work, track progress
          </p>
        </Link>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
