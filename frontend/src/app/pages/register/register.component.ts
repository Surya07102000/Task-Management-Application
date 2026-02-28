import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-card glass-card animate-fade-in">
      <div class="header">
        <h1>Create Account</h1>
        <p>Join the future of productivity today.</p>
      </div>

      <form (ngSubmit)="onRegister()">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="name" [(ngModel)]="name" required class="input-premium" placeholder="John Doe">
        </div>

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

        @if (success) {
          <div class="success-msg">Account created! Redirecting to login...</div>
        }

        <button type="submit" class="btn-premium w-full" [disabled]="loading">
          {{ loading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="footer">
        Already have an account? <a routerLink="/login">Sign in</a>
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

    .success-msg {
      color: #00e5ff;
      background: rgba(0, 229, 255, 0.1);
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 20px;
      border: 1px solid rgba(0, 229, 255, 0.2);
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
export class RegisterComponent {
    name = '';
    email = '';
    password = '';
    loading = false;
    error = '';
    success = false;

    private auth = inject(AuthService);
    private router = inject(Router);

    onRegister() {
        this.loading = true;
        this.error = '';
        this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
            next: () => {
                this.success = true;
                this.loading = false;
                setTimeout(() => this.router.navigate(['/login']), 2000);
            },
            error: (err) => {
                this.error = err.error.message || 'Registration failed';
                this.loading = false;
            }
        });
    }
}
