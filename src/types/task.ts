export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export const TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];
export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
