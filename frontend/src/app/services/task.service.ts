import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiBase}/tasks`;

    private getHeaders() {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getTasks(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    createTask(task: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, task, { headers: this.getHeaders() });
    }

    updateTask(id: number, task: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
    }

    deleteTask(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
