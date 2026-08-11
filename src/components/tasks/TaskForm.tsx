"use client";

import { FormEvent, useState } from "react";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  priorityLabels,
  statusLabels,
  type Task,
  type TaskInput,
  type TaskPriority,
  type TaskStatus,
} from "@/types/task";

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TaskForm({
  initialTask,
  onSubmit,
  onCancel,
  submitLabel = "Save task",
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? "todo");
  const [priority, setPriority] = useState<TaskPriority>(
    initialTask?.priority ?? "medium",
  );
  const [dueDate, setDueDate] = useState(initialTask?.due_date ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        due_date: dueDate || null,
      });
      if (!initialTask) {
        setTitle("");
        setDescription("");
        setStatus("todo");
        setPriority("medium");
        setDueDate("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm text-slate-300">
          Title
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
          placeholder="What needs to be done?"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm text-slate-300"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
          placeholder="Optional details..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm text-slate-300">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
          >
            {TASK_STATUSES.map((value) => (
              <option key={value} value={value}>
                {statusLabels[value]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="mb-1.5 block text-sm text-slate-300"
          >
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
          >
            {TASK_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {priorityLabels[value]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-1.5 block text-sm text-slate-300">
            Due date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
