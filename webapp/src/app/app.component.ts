import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="appbar">
      <div class="container" style="display:flex; gap:16px; align-items:center;">
        <a routerLink="/" style="display:flex; gap:10px; align-items:center; text-decoration:none; color:#e2e8f0;">
          <div style="width:28px; height:28px; border-radius:8px; background:linear-gradient(135deg, var(--primary), var(--accent));"></div>
          <strong>Angular Auth POC</strong>
        </a>
        <span class="spacer"></span>
        @if (!isAuth()) {
          <a class="btn outline" routerLink="/login" routerLinkActive="active">Sign in</a>
          <a class="btn" routerLink="/register" style="margin-left:8px;">Sign up</a>
        } @else {
          <a class="btn outline" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <button class="btn" style="margin-left:8px;" (click)="logout()">Log out</button>
        }
      </div>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  isAuth = computed(() => this.auth.isAuthenticated());
  logout() { this.auth.logout(); this.router.navigateByUrl('/'); }
}
