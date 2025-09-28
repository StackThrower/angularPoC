import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { TokenService } from './token.service';

export interface Credentials {
  email: string; password: string;
}
export interface RegisterPayload extends Credentials { name: string; }
export interface UserProfile { id: number; name: string; email: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = '/api';
  private userSig: WritableSignal<UserProfile | null> = signal<UserProfile | null>(null);
  user = computed(() => this.userSig());

  constructor(private http: HttpClient, private tokens: TokenService) {
    const token = this.tokens.getToken();
    if (token) {
      // On reload, try to get profile to validate token
      this.profile().subscribe({ next: (u) => this.userSig.set(u), error: () => this.logout() });
    }
  }

  isAuthenticated(): boolean { return !!this.tokens.getToken(); }

  login(payload: Credentials): Observable<UserProfile> {
    return this.http.post<{ token: string; user: UserProfile }>(`${this.baseUrl}/auth/login`, payload)
      .pipe(
        tap(({ token, user }) => { this.tokens.setToken(token); this.userSig.set(user); }),
        map(({ user }) => user)
      );
  }

  register(payload: RegisterPayload): Observable<UserProfile> {
    return this.http.post<{ token: string; user: UserProfile }>(`${this.baseUrl}/auth/register`, payload)
      .pipe(
        tap(({ token, user }) => { this.tokens.setToken(token); this.userSig.set(user); }),
        map(({ user }) => user)
      );
  }

  logout(): void { this.tokens.clearToken(); this.userSig.set(null); }

  profile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/profile`);
  }
}
