import { routes } from './app.routes';

describe('App Routes', () => {
  it('should contain core paths', () => {
    const paths = routes.map(r => r.path);
    expect(paths).toContain('');
    expect(paths).toContain('login');
    expect(paths).toContain('register');
    expect(paths).toContain('dashboard');
  });
});
