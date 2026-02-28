import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private apiBase = environment.apiBase;
    user = signal<any>(null);
    token = signal<string | null>(localStorage.getItem('token'));

    constructor() {
        const savedUser = localStorage.getItem('user');
        if (savedUser) this.user.set(JSON.parse(savedUser));
    }

    isLoggedIn() {
        return !!this.token();
    }

    login(credentials: any) {
        return this.http.post<any>(`${this.apiBase}/auth/login`, credentials).pipe(
            tap(res => {
                this.saveAuth(res.token, res.user);
            })
        );
    }

    register(userData: any) {
        return this.http.post<any>(`${this.apiBase}/auth/register`, userData);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.token.set(null);
        this.user.set(null);
        this.router.navigate(['/login']);
    }

    private saveAuth(token: string, user: any) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.token.set(token);
        this.user.set(user);
        this.router.navigate(['/dashboard']);
    }
}
