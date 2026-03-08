export type KanbanColumn = "backlog" | "todo" | "doing" | "done";
export type KanbanPriority = "low" | "medium" | "high" | "urgent";

export const KanbanPriorityArray = ["low", "medium", "high", "urgent"] as const;
export const KanbanColumnArray = ["backlog", "todo", "doing", "done"] as const;
