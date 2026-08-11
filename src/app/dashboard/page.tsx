import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/types/task";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Header email={user.email ?? "User"} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <TaskBoard
          initialTasks={(tasks ?? []) as Task[]}
          userId={user.id}
        />
      </main>
    </div>
  );
}
