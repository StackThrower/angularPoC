import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/auth/auth.service';
import { of } from 'rxjs';

class AuthMock { profile() { return of({ id: 1, name: 'John', email: 'john@example.com' }); } }

describe('DashboardComponent', () => {
  it('should render profile data', () => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [ { provide: AuthService, useClass: AuthMock } ]
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement as any;
    expect(el.textContent).toContain('John');
    expect(el.textContent).toContain('john@example.com');
  });
});

