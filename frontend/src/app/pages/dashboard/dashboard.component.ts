import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-wrap animate-fade-in">
      <header class="page-header">
        <div>
          <h1>My Master Plan</h1>
          <p>Organize your day for peak performance.</p>
        </div>
        <div class="stats">
          <div class="stat-card glass-card">
             <span class="val">{{ totalTasks() }}</span>
             <span class="lbl">Total</span>
          </div>
          <div class="stat-card glass-card purple">
             <span class="val">{{ pendingTasks() }}</span>
             <span class="lbl">Pending</span>
          </div>
          <div class="stat-card glass-card blue">
             <span class="val">{{ completedTasks() }}</span>
             <span class="lbl">Done</span>
          </div>
        </div>
      </header>

      <div class="content-grid">
        <section class="add-task-section">
          <div class="glass-card p-40">
            <h3>New Strategic Task</h3>
            <form (ngSubmit)="onCreateTask()">
              <input type="text" name="title" [(ngModel)]="newTask.title" required class="input-premium mb-20" placeholder="Task objective...">
              <textarea name="description" [(ngModel)]="newTask.description" class="input-premium mb-20" placeholder="Details (optional)"></textarea>
              <div class="row">
                <input type="date" name="dueDate" [(ngModel)]="newTask.dueDate" class="input-premium flex-1">
                <select name="priority" [(ngModel)]="newTask.priority" class="input-premium flex-1">
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button type="submit" class="btn-premium" [disabled]="!newTask.title">Deploy</button>
              </div>
            </form>
          </div>
        </section>

        <section class="task-list-section">
          <div class="list-header">
            <h3>Recent Objectives</h3>
            <div class="filters">
               <button (click)="filter.set('all')" [class.active]="filter() === 'all'">All</button>
               <button (click)="filter.set('pending')" [class.active]="filter() === 'pending'">Pending</button>
               <button (click)="filter.set('completed')" [class.active]="filter() === 'completed'">Completed</button>
            </div>
          </div>

          @for (task of filteredTasks(); track task.id) {
            <div class="task-item glass-card" [class.done]="task.status === 'completed'">
              @if (editingTaskId() === task.id) {
                <div class="edit-mode-container w-full">
                  <input type="text" [(ngModel)]="editingTaskDraft.title" class="input-premium mb-10" placeholder="Task title">
                  <textarea [(ngModel)]="editingTaskDraft.description" class="input-premium mb-10" placeholder="Description"></textarea>
                  <div class="row mb-10">
                    <input type="date" [(ngModel)]="editingTaskDraft.dueDate" class="input-premium flex-1">
                    <select [(ngModel)]="editingTaskDraft.priority" class="input-premium flex-1">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <div class="actions" style="justify-content: flex-end;">
                    <button (click)="saveEdit(task)" class="icon-btn check">✓</button>
                    <button (click)="cancelEdit()" class="icon-btn del">×</button>
                  </div>
                </div>
              } @else {
                <div class="task-info">
                  <h4>
                    {{ task.title }}
                    <span class="badge" [ngClass]="task.priority || 'low'">{{ task.priority || 'low' }}</span>
                  </h4>
                  <p>{{ task.description }}</p>
                  <div class="meta" *ngIf="task.dueDate">
                    📅 {{ task.dueDate | date:'mediumDate' }}
                  </div>
                </div>
                <div class="actions">
                  @if (task.status !== 'completed') {
                    <button (click)="startEdit(task)" class="icon-btn edit" title="Edit">✎</button>
                    <button (click)="toggleDone(task)" class="icon-btn check" title="Complete">✓</button>
                  } @else {
                    <button (click)="toggleDone(task)" class="icon-btn undo" title="Undo">↺</button>
                  }
                  <button (click)="onDeleteTask(task.id)" class="icon-btn del" title="Delete">×</button>
                </div>
              }
            </div>
          } @empty {
            <div class="empty-state glass-card">
              No tasks matched your vision. Time to dream big!
            </div>
          }
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrap { max-width: 1200px; margin: 0 auto; }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }

    h1 { font-size: 38px; font-weight: 800; margin-bottom: 8px; }
    header p { color: var(--text-secondary); font-size: 18px; }

    .stats { display: flex; gap: 15px; }
    .stat-card {
      padding: 15px 25px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 110px;
    }
    .stat-card .val { font-size: 24px; font-weight: 700; }
    .stat-card .lbl { font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
    
    .stat-card.purple { border-bottom: 3px solid var(--primary); }
    .stat-card.blue { border-bottom: 3px solid var(--secondary); }

    .content-grid {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 30px;
    }

    h3 { margin-bottom: 25px; font-size: 20px; font-weight: 600; }
    .p-40 { padding: 40px; }
    .mb-20 { margin-bottom: 20px; }
    .row { display: flex; gap: 10px; }
    .flex-1 { flex: 1; }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .filters {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 4px;
    }

    .filters button {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      padding: 6px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: 0.3s;
    }

    .filters button.active {
      background: var(--bg-card);
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .task-item {
      display: flex;
      padding: 20px 25px;
      margin-bottom: 15px;
      justify-content: space-between;
      align-items: center;
    }

    .task-item.done h4 { text-decoration: line-through; color: var(--text-secondary); }
    .task-item h4 { font-size: 18px; margin-bottom: 6px; transition: 0.3s; }
    .task-item p { font-size: 14px; color: var(--text-secondary); }
    .task-item .meta { font-size: 12px; margin-top: 10px; color: var(--primary); font-weight: 600; }

    .actions { display: flex; gap: 10px; }
    .icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: 0.3s;
    }

    .icon-btn.check:hover { background: #4caf50; border-color: #4caf50; }
    .icon-btn.undo:hover { background: #ff9800; border-color: #ff9800; }
    .icon-btn.del:hover { background: #f44336; border-color: #f44336; }

    .empty-state { padding: 60px; text-align: center; color: var(--text-secondary); font-style: italic; }

    .badge {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 12px;
      margin-left: 10px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .badge.low { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .badge.medium { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .badge.high { background: rgba(239, 68, 68, 0.2); color: #f87171; }
  `]
})
export class DashboardComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks = signal<any[]>([]);
  filter = signal<'all' | 'pending' | 'completed'>('all');

  newTask = { title: '', description: '', dueDate: '', priority: 'low' };

  editingTaskId = signal<number | null>(null);
  editingTaskDraft = { title: '', description: '', dueDate: '', priority: 'low' };

  filteredTasks = computed(() => {
    const list = this.tasks();
    const f = this.filter();
    if (f === 'all') return list;
    return list.filter(t => t.status === f);
  });

  totalTasks = computed(() => this.tasks().length);
  pendingTasks = computed(() => this.tasks().filter(t => t.status === 'pending').length);
  completedTasks = computed(() => this.tasks().filter(t => t.status === 'completed').length);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => this.tasks.set(tasks));
  }

  onCreateTask() {
    this.taskService.createTask(this.newTask).subscribe(task => {
      this.tasks.update(ts => [task, ...ts]);
      this.newTask = { title: '', description: '', dueDate: '', priority: 'low' };
    });
  }

  toggleDone(task: any) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Send priority to not fail validation or lose it
    const updatePayload = {
      status: newStatus,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      priority: task.priority
    };
    this.taskService.updateTask(task.id, updatePayload).subscribe(updated => {
      this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
    });
  }

  startEdit(task: any) {
    this.editingTaskDraft = {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      priority: task.priority || 'low'
    };
    this.editingTaskId.set(task.id);
  }

  cancelEdit() {
    this.editingTaskId.set(null);
  }

  saveEdit(task: any) {
    this.taskService.updateTask(task.id, this.editingTaskDraft).subscribe(updated => {
      this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
      this.editingTaskId.set(null);
    });
  }

  onDeleteTask(id: number) {
    if (confirm('Are you sure you want to archive this objective?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.tasks.update(ts => ts.filter(t => t.id !== id));
      });
    }
  }
}
