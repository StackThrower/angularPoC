import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, delay, dematerialize, materialize, of, throwError } from 'rxjs';

interface UserEntity { id: number; name: string; email: string; password: string; }
const USERS_KEY = 'fake_users';

function readUsers(): UserEntity[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as UserEntity[]; } catch { return []; }
}
function writeUsers(users: UserEntity[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function ok<T>(body: T) {
  return of(new HttpResponse({ status: 200, body }));
}
function unauthorized(message = 'Unauthorized') {
  return throwError(() => ({ status: 401, error: { message } }));
}
function badRequest(message: string) {
  return throwError(() => ({ status: 400, error: { message } }));
}

function makeToken(user: UserEntity): string {
  // Simple unsigned pseudo-JWT for demo: header.payload.signature
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: user.id, name: user.name, email: user.email, exp: Date.now() + 1000 * 60 * 60 }));
  const signature = 'demo';
  return `${header}.${payload}.${signature}`;
}

function isLoggedIn(req: HttpRequest<unknown>): UserEntity | null {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const token = auth.slice(7);
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() > payload.exp) return null;
    const users = readUsers();
    return users.find(u => u.id === payload.sub) || null;
  } catch {
    return null;
  }
}

export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req;

  // Only handle API calls
  if (!url.startsWith('/api/')) {
    return next(req);
  }

  return handle();

  function handle(): Observable<HttpEvent<unknown>> {
    switch (true) {
      case url.endsWith('/api/auth/register') && method === 'POST':
        return register();
      case url.endsWith('/api/auth/login') && method === 'POST':
        return login();
      case url.endsWith('/api/profile') && method === 'GET':
        return getProfile();
      default:
        return next(req);
    }
  }

  function register(): Observable<HttpEvent<unknown>> {
    const users = readUsers();
    const { name, email, password } = body as { name: string; email: string; password: string };
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return badRequest('A user with this email already exists');
    }
    const newUser: UserEntity = { id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1, name, email, password };
    users.push(newUser); writeUsers(users);
    const token = makeToken(newUser);
    return ok({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } }).pipe(materialize(), delay(400), dematerialize());
  }

  function login(): Observable<HttpEvent<unknown>> {
    const users = readUsers();
    const { email, password } = body as { email: string; password: string };
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return unauthorized('Invalid email or password');
    const token = makeToken(user);
    return ok({ token, user: { id: user.id, name: user.name, email: user.email } }).pipe(materialize(), delay(300), dematerialize());
  }

  function getProfile(): Observable<HttpEvent<unknown>> {
    const user = isLoggedIn(req);
    if (!user) return unauthorized();
    return ok({ id: user.id, name: user.name, email: user.email }).pipe(materialize(), delay(200), dematerialize());
  }
};
