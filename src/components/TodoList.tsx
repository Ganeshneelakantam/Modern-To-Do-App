import React from 'react';
import { Todo } from '../types';
import { Calendar, Clock, Tag, AlertCircle, Pencil, Trash2, CheckCircle, Circle } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`group bg-card text-card-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
            todo.completed ? 'opacity-75' : ''
          }`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <button
                onClick={() => onToggle(todo.id)}
                className="mt-1 text-primary hover:text-primary/80 transition-colors duration-200"
              >
                {todo.completed ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className={`text-xl font-semibold ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="mt-2 text-muted-foreground leading-relaxed">{todo.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  {todo.dueDate && (
                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                      <Calendar className="h-4 w-4" />
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    getPriorityColor(todo.priority)
                  } bg-opacity-10`}>
                    <AlertCircle className="h-4 w-4" />
                    {todo.priority}
                  </div>
                  {todo.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <div className="flex flex-wrap gap-2">
                        {todo.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {todo.subtasks.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-border space-y-2">
                    {todo.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2 group/subtask">
                        {subtask.completed ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={`${subtask.completed ? 'line-through text-muted-foreground' : ''} group-hover/subtask:text-primary transition-colors`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => onEdit(todo)}
                  className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
                  aria-label="Edit todo"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="p-2 rounded-lg hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors"
                  aria-label="Delete todo"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}