import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-card glass-card animate-fade-in">
      <div class="header">
        <h1>Welcome Back</h1>
        <p>Enter your credentials to access your dashboard.</p>
      </div>

      <form (ngSubmit)="onLogin()" #loginForm="ngForm">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" [(ngModel)]="email" required class="input-premium" placeholder="name@example.com">
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" [(ngModel)]="password" required class="input-premium" placeholder="••••••••">
        </div>

        @if (error) {
          <div class="error-msg">{{ error }}</div>
        }

        <button type="submit" class="btn-premium w-full" [disabled]="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="footer">
        Don't have an account? <a routerLink="/register">Sign up</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-card {
      width: 450px;
      padding: 50px;
    }

    .header {
      margin-bottom: 40px;
      text-align: center;
    }

    h1 {
      font-size: 32px;
      margin-bottom: 12px;
      font-weight: 700;
      color: white;
    }

    p {
      color: var(--text-secondary);
      font-size: 16px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    label {
      display: block;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .w-full { width: 100%; margin-top: 20px; }

    .error-msg {
      color: #ff6384;
      background: rgba(255, 99, 132, 0.1);
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 20px;
      border: 1px solid rgba(255, 99, 132, 0.2);
    }

    .footer {
      margin-top: 30px;
      text-align: center;
      color: var(--text-secondary);
    }

    a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }

    a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  private auth = inject(AuthService);

  onLogin() {
    this.loading = true;
    this.error = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => (this.loading = false),
      error: (err) => {
        this.error = err.error.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
