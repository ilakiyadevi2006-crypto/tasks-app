"use client";

import { Calendar, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  priorityLabels,
  statusLabels,
  type Task,
  type TaskInput,
} from "@/types/task";
import { TaskForm } from "./TaskForm";

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, input: TaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const priorityStyles = {
  low: "bg-slate-500/20 text-slate-300",
  medium: "bg-amber-500/20 text-amber-200",
  high: "bg-red-500/20 text-red-200",
};

const statusStyles = {
  todo: "bg-slate-500/20 text-slate-300",
  in_progress: "bg-blue-500/20 text-blue-200",
  done: "bg-emerald-500/20 text-emerald-200",
};

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <article className="rounded-xl border border-indigo-400/30 bg-slate-900/80 p-4">
        <TaskForm
          initialTask={task}
          submitLabel="Update task"
          onCancel={() => setEditing(false)}
          onSubmit={async (input) => {
            await onUpdate(task.id, input);
            setEditing(false);
          }}
        />
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-white/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-medium text-white">{task.title}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-slate-400">{task.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status]}`}
            >
              {statusLabels[task.status]}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
            >
              {priorityLabels[task.priority]}
            </span>
            {task.due_date && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(task.due_date + "T00:00:00").toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{deleting ? "..." : "Delete"}</span>
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
      
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10">
          <Trash2 className="h-5 w-5 text-red-400" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Delete task?
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-medium text-slate-200">
              "{task.title}"
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(false)}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={async () => {
            await handleDelete();
            setShowDeleteConfirm(false);
          }}
          disabled={deleting}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

    </div>
  </div>
)}
    </article>
  );
}
