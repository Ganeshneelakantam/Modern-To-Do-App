import React, { useState } from 'react';
import { Todo } from '../types';
import { Plus, X } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  initialData?: Todo;
  onCancel?: () => void;
}

export function TodoForm({ onSubmit, initialData, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Todo['priority']>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [subtasks, setSubtasks] = useState(initialData?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      completed: false,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags,
      subtasks,
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        { id: Date.now().toString(), title: newSubtask.trim(), completed: false },
      ]);
      setNewSubtask('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          placeholder="Enter task title..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          placeholder="Enter task description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Todo['priority'])}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="ml-2 hover:text-destructive transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add Tag
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Subtasks
        </label>
        <div className="space-y-2 mb-3">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-2 bg-accent/50 rounded-lg p-3">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => {
                  setSubtasks(
                    subtasks.map((st) =>
                      st.id === subtask.id ? { ...st, completed: !st.completed } : st
                    )
                  );
                }}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                {subtask.title}
              </span>
              <button
                type="button"
                onClick={() => setSubtasks(subtasks.filter((st) => st.id !== subtask.id))}
                className="ml-auto text-destructive hover:text-destructive/80 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add a subtask"
            className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={addSubtask}
            className="px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add Subtask
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg border border-input hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {initialData ? 'Update' : 'Create'} Todo
        </button>
      </div>
    </form>
  );
}