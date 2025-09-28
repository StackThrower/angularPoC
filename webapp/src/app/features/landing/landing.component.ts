import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
  <section class="container" style="padding-top:56px; padding-bottom:56px;">
    <div class="card" style="display:grid; gap:24px; text-align:center; padding:48px;">
      <h1 style="margin:0; font-size:40px; line-height:1.1;">
        Welcome to <span style="background:linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip:text; background-clip:text; color:transparent;">Angular Auth</span>
      </h1>
      <p style="margin:0; color:var(--muted); font-size:18px;">
        A basic Angular 20 prototype: sign up, sign in, and JWT handling.
      </p>
      <div style="display:flex; gap:12px; justify-content:center;">
        <a class="btn" routerLink="/register">Get started</a>
        <a class="btn outline" routerLink="/login">I already have an account</a>
      </div>
    </div>
  </section>
  `,
})
export class LandingComponent {}
