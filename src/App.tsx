import React, { useState, useEffect } from 'react';
import { Todo, FilterOption, SortOption, PriorityFilter } from './types';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ListFilter, SortAsc, Plus, Moon, Sun, CheckCircle2, Calendar, Clock, AlertCircle } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sort, setSort] = useState<SortOption>('createdAt');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode');
      return isDark ? JSON.parse(isDark) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
    setShowForm(false);
  };

  const handleUpdateTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    if (!editingTodo) return;
    const updatedTodo: Todo = {
      ...todoData,
      id: editingTodo.id,
      createdAt: editingTodo.createdAt,
    };
    setTodos(todos.map((todo) => (todo.id === editingTodo.id ? updatedTodo : todo)));
    setEditingTodo(null);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const upcoming = todos.filter(todo => todo.dueDate && new Date(todo.dueDate) > new Date()).length;
    const highPriority = todos.filter(todo => todo.priority === 'high').length;
    return { total, completed, upcoming, highPriority };
  };

  const stats = getStats();

  const filteredAndSortedTodos = todos
    .filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter((todo) => {
      if (priorityFilter === 'all') return true;
      return todo.priority === priorityFilter;
    })
    .filter((todo) =>
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description?.toLowerCase().includes(search.toLowerCase()) ||
      todo.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sort) {
        case 'priority':
          const priority = { high: 3, medium: 2, low: 1 };
          return priority[b.priority] - priority[a.priority];
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Todo App</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Total Tasks</span>
              </div>
              <p className="text-2xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Upcoming</span>
              </div>
              <p className="text-2xl font-bold mt-2">{stats.upcoming}</p>
            </div>
            <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold mt-2">{stats.completed}</p>
            </div>
            <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium">High Priority</span>
              </div>
              <p className="text-2xl font-bold mt-2">{stats.highPriority}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search todos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <ListFilter className="text-muted-foreground" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterOption)}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-muted-foreground" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <SortAsc className="text-muted-foreground" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Todo
            </button>
          </div>

          {(showForm || editingTodo) && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">
                  {editingTodo ? 'Edit Todo' : 'New Todo'}
                </h2>
                <TodoForm
                  onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
                  initialData={editingTodo || undefined}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTodo(null);
                  }}
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredAndSortedTodos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No todos found. Add some tasks to get started!
                </p>
              </div>
            ) : (
              <TodoList
                todos={filteredAndSortedTodos}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onEdit={setEditingTodo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;