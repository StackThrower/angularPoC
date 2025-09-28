import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, RegisterPayload, UserProfile } from './auth.service';
import { TokenService } from './token.service';

class TokenServiceMock {
  private token: string | null = null;
  getToken() { return this.token; }
  setToken(t: string) { this.token = t; }
  clearToken() { this.token = null; }
}

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  let tokens: TokenServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useClass: TokenServiceMock }
      ]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    tokens = TestBed.inject(TokenService) as any as TokenServiceMock;
  });

  afterEach(() => {
    http.verify();
  });

  it('should login and store token and user', () => {
    const user: UserProfile = { id: 1, name: 'John', email: 'john@example.com' };
    service.login({ email: 'john@example.com', password: 'secret' }).subscribe((u) => {
      expect(tokens.getToken()).toBe('tok');
      expect(u).toEqual(user);
    });

    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'tok', user });
  });

  it('should register and store token and user', () => {
    const payload: RegisterPayload = { name: 'John', email: 'john@example.com', password: 'secret' };
    const user: UserProfile = { id: 2, name: 'John', email: 'john@example.com' };
    service.register(payload).subscribe((u) => {
      expect(tokens.getToken()).toBe('tok2');
      expect(u).toEqual(user);
    });
    const req = http.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'tok2', user });
  });

  it('should logout and clear token', () => {
    tokens.setToken('x');
    service.logout();
    expect(tokens.getToken()).toBeNull();
  });
});

