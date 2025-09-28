import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { fakeBackendInterceptor } from './fake-backend.interceptor';

describe('fakeBackendInterceptor', () => {
  let http: HttpClient;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([fakeBackendInterceptor]))
      ]
    });
    http = TestBed.inject(HttpClient);
  });

  it('should register a new user and then login successfully', async () => {
    const reg: any = await firstValueFrom(http.post('/api/auth/register', { name: 'A', email: 'a@a.com', password: 'secret' }));
    expect(reg.token).toBeTruthy();
    expect(reg.user.email).toBe('a@a.com');

    const login: any = await firstValueFrom(http.post('/api/auth/login', { email: 'a@a.com', password: 'secret' }));
    expect(login.user.name).toBe('A');
  });

  it('should fail login with wrong password', async () => {
    await firstValueFrom(http.post('/api/auth/register', { name: 'A', email: 'a@a.com', password: 'secret' }));
    try {
      await firstValueFrom(http.post('/api/auth/login', { email: 'a@a.com', password: 'bad' }));
      fail('Expected to throw');
    } catch (e: any) {
      expect(e.status).toBe(401);
    }
  });
});
