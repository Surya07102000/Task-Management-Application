import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
    template: `
    <div class="app-container">
      @if (auth.isLoggedIn()) {
        <nav class="sidebar glass-card">
          <div class="logo">FocusTask</div>
          <div class="nav-links">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
               <span class="icon">🏠</span> Dashboard
            </a>
          </div>
          <div class="user-footer">
            <div class="user-info">
              <span class="avatar">{{ auth.user()?.name?.[0]?.toUpperCase() }}</span>
              <span class="name">{{ auth.user()?.name }}</span>
            </div>
            <button class="logout-btn" (click)="auth.logout()">Logout</button>
          </div>
        </nav>
      }

      <main class="main-content" [class.no-sidebar]="!auth.isLoggedIn()">
        <router-outlet></router-outlet>
      </main>

      <div class="background-decor">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
    </div>
  `,
    styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      position: relative;
    }

    .sidebar {
      width: 260px;
      margin: 20px;
      display: flex;
      flex-direction: column;
      padding: 30px 20px;
      position: sticky;
      top: 20px;
      height: calc(100vh - 40px);
      z-index: 10;
    }

    .logo {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 50px;
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -1px;
    }

    .nav-links {
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 14px 18px;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 12px;
      margin-bottom: 8px;
      transition: all 0.3s;
    }

    .nav-item:hover, .nav-item.active {
      color: white;
      background: rgba(148, 0, 255, 0.15);
      backdrop-filter: blur(5px);
    }

    .nav-item.active {
      background: rgba(148, 0, 255, 0.2);
      border-left: 3px solid var(--primary);
    }

    .user-footer {
      border-top: 1px solid var(--glass-border);
      padding-top: 20px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      background: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .logout-btn {
      width: 100%;
      background: transparent;
      border: 1px solid rgba(255, 99, 132, 0.3);
      color: #ff6384;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      transition: 0.3s;
    }

    .logout-btn:hover {
      background: rgba(255, 99, 132, 0.1);
    }

    .main-content {
      flex: 1;
      padding: 30px;
      z-index: 5;
    }

    .no-sidebar {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .background-decor {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
    }

    .blob {
      position: absolute;
      filter: blur(100px);
      opacity: 0.2;
      border-radius: 50%;
    }

    .blob-1 {
      width: 400px;
      height: 400px;
      background: var(--primary);
      top: -100px;
      right: -100px;
    }

    .blob-2 {
      width: 500px;
      height: 500px;
      background: var(--secondary);
      bottom: -150px;
      left: -150px;
    }
  `]
})
export class AppComponent {
    auth = inject(AuthService);
}
