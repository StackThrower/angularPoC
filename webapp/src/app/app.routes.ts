import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent, title: 'Home' },
  { path: 'login', component: LoginComponent, title: 'Sign in' },
  { path: 'register', component: RegisterComponent, title: 'Sign up' },
  { path: 'dashboard', canActivate: [authGuard], component: DashboardComponent, title: 'Dashboard' },
  { path: '**', redirectTo: '' },
];

