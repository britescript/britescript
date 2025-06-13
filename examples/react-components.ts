import React from 'react';

interface Renderable {
  getDisplayName(): string;
  getClassName(): string;
}
interface Interactive {
  onClick(): void;
  onHover(): void;
}
type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
}
type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
}
class UserRenderableImpl implements Renderable {
  getDisplayName(): void {
    // TODO: Implement method
  }

  getClassName(): void {
    // TODO: Implement method
  }
}

function withRenderable<T extends User>(obj: T): T & Renderable {
  const impl = new UserRenderableImpl();
  const result = Object.assign(obj, impl);
  // Copy prototype methods
  Object.getOwnPropertyNames(UserRenderableImpl.prototype).forEach(name => {
    if (name !== 'constructor') {
      result[name] = impl[name].bind(result);
    }
  });
  return result as T & Renderable;
}
class UserInteractiveImpl implements Interactive {
  onClick(): void {
    // TODO: Implement method
  }

  onHover(): void {
    // TODO: Implement method
  }
}

function withInteractive<T extends User>(obj: T): T & Interactive {
  const impl = new UserInteractiveImpl();
  const result = Object.assign(obj, impl);
  // Copy prototype methods
  Object.getOwnPropertyNames(UserInteractiveImpl.prototype).forEach(name => {
    if (name !== 'constructor') {
      result[name] = impl[name].bind(result);
    }
  });
  return result as T & Interactive;
}
class TaskRenderableImpl implements Renderable {
  getDisplayName(): void {
    // TODO: Implement method
  }

  getClassName(): void {
    // TODO: Implement method
  }
}

function withRenderable<T extends Task>(obj: T): T & Renderable {
  const impl = new TaskRenderableImpl();
  const result = Object.assign(obj, impl);
  // Copy prototype methods
  Object.getOwnPropertyNames(TaskRenderableImpl.prototype).forEach(name => {
    if (name !== 'constructor') {
      result[name] = impl[name].bind(result);
    }
  });
  return result as T & Renderable;
}
class TaskInteractiveImpl implements Interactive {
  onClick(): void {
    // TODO: Implement method
  }

  onHover(): void {
    // TODO: Implement method
  }
}

function withInteractive<T extends Task>(obj: T): T & Interactive {
  const impl = new TaskInteractiveImpl();
  const result = Object.assign(obj, impl);
  // Copy prototype methods
  Object.getOwnPropertyNames(TaskInteractiveImpl.prototype).forEach(name => {
    if (name !== 'constructor') {
      result[name] = impl[name].bind(result);
    }
  });
  return result as T & Interactive;
}

function UserCard({ user }: { user: User }) {
  return (
    <div 
      className={user.getClassName()}
      onClick={() => user.onClick()}
      onMouseEnter={() => user.onHover()}
    >
      <img src={user.avatar} alt={user.name} />
      <div className="user-info">
        <h3>{user.getDisplayName()}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
function TaskItem({ task }: { task: Task }) {
  return (
    <div 
      className={task.getClassName()}
      onClick={() => task.onClick()}
      onMouseEnter={() => task.onHover()}
    >
      <span className="task-title">{task.getDisplayName()}</span>
      <span className="task-priority">{task.priority}</span>
    </div>
  );
}
function App() {
  const users: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", avatar: "/alice.jpg", isOnline: true },
    { id: 2, name: "Bob Smith", email: "bob@example.com", avatar: "/bob.jpg", isOnline: false },
  ];
  const tasks: Task[] = [
    { id: 1, title: "Learn Britescript", completed: false, priority: "high" },
    { id: 2, title: "Build React app", completed: true, priority: "medium" },
    { id: 3, title: "Write documentation", completed: false, priority: "low" },
  ];
  return (
    <div className="app">
      <header>
        <h1>Britescript + JSX Demo (.bsx)</h1>
        <p>Mixing Britescript structs/traits with React components!</p>
      </header>
      <main>
        <section className="users-section">
          <h2>Team Members</h2>
          <div className="users-grid">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </section>
        <section className="tasks-section">
          <h2>Project Tasks</h2>
          <div className="tasks-list">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
console.log("=== Mixed TypeScript + Britescript ===");
const completedCount = tasks.filter(t => t.completed).length;
console.log(`Completed tasks: ${completedCount}`);
export default App;
export { User, Task, UserCard, TaskItem };
console.log("🚀 .bsx file with mixed Britescript + JSX complete!");