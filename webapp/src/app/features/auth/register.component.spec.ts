import { TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

class AuthMock { register() { return of({}); } }
class RouterMock { navigateByUrl() {} }
const ActivatedRouteMock = { snapshot: { queryParamMap: { get: (_: string) => null } } } as unknown as ActivatedRoute;

describe('RegisterComponent', () => {
  it('should submit when form is valid and navigate to dashboard', () => {
    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useClass: AuthMock },
        { provide: Router, useClass: RouterMock },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    comp.form.setValue({ name: 'John', email: 'a@a.com', password: 'secret' });
    comp.submit();

    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
