import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

class AuthMock {
  login() { return of({}); }
}

class RouterMock { navigateByUrl() {} }

const ActivatedRouteMock = {
  snapshot: { queryParamMap: { get: (_: string) => null } }
} as unknown as ActivatedRoute;

describe('LoginComponent', () => {
  it('should submit when form is valid and navigate to dashboard', () => {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: AuthMock },
        { provide: Router, useClass: RouterMock },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    comp.form.setValue({ email: 'a@a.com', password: 'secret' });
    comp.submit();

    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should show error when login fails', () => {
    TestBed.resetTestingModule();
    class AuthErrorMock { login() { return throwError(() => ({ error: { message: 'Sign-in failed' } })); } }
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: AuthErrorMock },
        { provide: Router, useClass: RouterMock },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    comp.form.setValue({ email: 'a@a.com', password: 'secret' });
    comp.submit();
    expect(comp.error).toBe('Sign-in failed');
  });
});
