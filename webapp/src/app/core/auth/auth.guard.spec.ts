import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';

describe('authGuard', () => {
  it('should allow activation when authenticated', () => {
    const routerMock = { navigate: jasmine.createSpy('navigate') } as any as Router;
    const authMock = { isAuthenticated: () => true } as AuthService;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authMock }
      ]
    });

    const res = TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/dashboard' } as any));
    expect(res).toBeTrue();
  });

  it('should redirect to /login when NOT authenticated', () => {
    const navigateSpy = jasmine.createSpy('navigate');
    const routerMock = { navigate: navigateSpy } as any as Router;
    const authMock = { isAuthenticated: () => false } as AuthService;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authMock }
      ]
    });

    const res = TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/dashboard' } as any));
    expect(res).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/dashboard' } });
  });
});
