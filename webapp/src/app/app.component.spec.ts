import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './core/auth/auth.service';

class AuthMock {
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
});

