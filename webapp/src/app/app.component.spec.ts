import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './core/auth/auth.service';
import { signal } from '@angular/core';

class AuthMock {
  // Provide a signal-compatible `user` accessor like the real service
  user = signal<any>(null);
  isAuthenticated() { return false; }
  logout() {}
}

describe('AppComponent', () => {
  it('should render navbar links and respond to logout', () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppComponent],
      providers: [{ provide: AuthService, useClass: AuthMock }]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement as any;
    expect(el.textContent).toContain('Sign in');
    expect(el.textContent).toContain('Sign up');
  });

  it('should show Dashboard and Log out after auth user is set', () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppComponent],
      providers: [{ provide: AuthService, useClass: AuthMock }]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const auth = TestBed.inject(AuthService) as unknown as AuthMock;
    fixture.detectChanges();
    // Initially unauthenticated
    let el: HTMLElement = fixture.nativeElement as any;
    expect(el.textContent).toContain('Sign in');

    // Simulate login by setting the user signal
    auth.user.set({ id: 1, name: 'Test', email: 't@example.com' });
    fixture.detectChanges();

    el = fixture.nativeElement as any;
    expect(el.textContent).toContain('Dashboard');
    expect(el.textContent).toContain('Log out');
  });
});
