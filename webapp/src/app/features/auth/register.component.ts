import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="container" style="display:grid; place-items:center; padding-top:56px;">
    <div class="card" style="width:100%; max-width:420px;">
      <h2 style="margin-top:0">Sign up</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:14px;">
        <div class="form-field">
          <label>Name</label>
          <input class="input" type="text" formControlName="name" placeholder="John Doe">
          <div class="error" *ngIf="form.touched && form.get('name')?.invalid">Required</div>
        </div>
        <div class="form-field">
          <label>Email</label>
          <input class="input" type="email" formControlName="email" placeholder="you@example.com">
          <div class="error" *ngIf="form.touched && form.get('email')?.invalid">Enter a valid email</div>
        </div>
        <div class="form-field">
          <label>Password</label>
          <input class="input" type="password" formControlName="password" placeholder="At least 6 characters">
          <div class="error" *ngIf="form.touched && form.get('password')?.invalid">At least 6 characters</div>
        </div>
        <div class="error" *ngIf="error">{{ error }}</div>
        <button class="btn" type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Creating…' : 'Create account' }}</button>
      </form>
      <p style="color:var(--muted)">Already have an account? <a class="link" routerLink="/login">Sign in</a></p>
    </div>
  </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error: string | null = null;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.error = null; this.loading = true;
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl(returnUrl),
      error: (e) => { this.error = e?.error?.message || 'Sign-up failed'; this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }
}
