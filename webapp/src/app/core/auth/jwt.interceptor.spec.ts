import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { jwtInterceptor } from './jwt.interceptor';
import { TokenService } from './token.service';

describe('jwtInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: { getToken: () => 'token123' } }
      ]
    });
  });

  it('should add Authorization header for /api/ requests when token exists', (done) => {
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.get('Authorization')).toBe('Bearer token123');
      done();
      return {} as any;
    };
    const req = new HttpRequest('GET', '/api/profile');

    TestBed.runInInjectionContext(() => jwtInterceptor(req, next as any));
  });

  it('should NOT add Authorization header for non-/api requests', (done) => {
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.get('Authorization')).toBeNull();
      done();
      return {} as any;
    };
    const req = new HttpRequest('GET', 'https://example.com/data');
    TestBed.runInInjectionContext(() => jwtInterceptor(req, next as any));
  });
});
