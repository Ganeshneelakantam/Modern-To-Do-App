export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  subtasks: SubTask[];
  createdAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export type SortOption = 'priority' | 'dueDate' | 'createdAt';
export type FilterOption = 'all' | 'active' | 'completed';
export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';