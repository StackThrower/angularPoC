import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container" style="padding-top:32px; display:grid; gap:16px;">
      <div class="card">
        <h2 style="margin-top:0">Dashboard</h2>
        <ng-container *ngIf="profile as p; else loadingTpl">
          <p><strong>Name:</strong> {{ p.name }}</p>
          <p><strong>Email:</strong> {{ p.email }}</p>
          <a class="link" routerLink="/">Go to home</a>
        </ng-container>
        <ng-template #loadingTpl>
          <p style="color:var(--muted)">Loading profile…</p>
        </ng-template>
      </div>
    </section>
  `,
})
export class DashboardComponent {
  private auth = inject(AuthService);
  profile: UserProfile | null = null;

  constructor() {
    this.auth.profile().subscribe({ next: (p: UserProfile) => (this.profile = p) });
  }
}
