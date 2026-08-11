"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  TASK_STATUSES,
  statusLabels,
  type Task,
  type TaskInput,
  type TaskStatus,
} from "@/types/task";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";

interface TaskBoardProps {
  initialTasks: Task[];
  userId: string;
}

export function TaskBoard({ initialTasks, userId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const refreshTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTasks(data as Task[]);
    }
  }, [supabase, userId]);

  useEffect(() => {
    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          refreshTasks();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, refreshTasks]);

  async function createTask(input: TaskInput) {
    const { error } = await supabase.from("tasks").insert({
      user_id: userId,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
      due_date: input.due_date ?? null,
    });

    if (error) throw new Error(error.message);
    setShowForm(false);
    await refreshTasks();
  }

  async function updateTask(id: string, input: TaskInput) {
    const { error } = await supabase
      .from("tasks")
      .update({
        title: input.title,
        description: input.description ?? null,
        status: input.status,
        priority: input.priority,
        due_date: input.due_date ?? null,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
    await refreshTasks();
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await refreshTasks();
  }

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Your tasks</h2>
          <p className="text-sm text-slate-400">
            {counts.all} total · {counts.done} completed
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          {showForm ? "Close form" : "New task"}
        </button>
      </div>

      {showForm && (
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 sm:p-6">
          <h3 className="mb-4 text-lg font-medium text-white">Create a task</h3>
          <TaskForm onSubmit={createTask} submitLabel="Create task" />
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={filter === "all"}
          label={`All (${counts.all})`}
          onClick={() => setFilter("all")}
        />
        {TASK_STATUSES.map((status) => (
          <FilterButton
            key={status}
            active={filter === status}
            label={`${statusLabels[status]} (${counts[status]})`}
            onClick={() => setFilter(status)}
          />
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-6 py-12 text-center">
          <p className="text-slate-300">No tasks yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first task to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? "bg-indigo-500 text-white"
          : "border border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
