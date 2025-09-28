import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  const key = 'jwt_token';

  beforeEach(() => {
    service = new TokenService();
    localStorage.clear();
  });

  it('should set and get token', () => {
    service.setToken('abc');
    expect(service.getToken()).toBe('abc');
    expect(localStorage.getItem(key)).toBe('abc');
  });

  it('should clear token', () => {
    service.setToken('abc');
    service.clearToken();
    expect(service.getToken()).toBeNull();
  });
});

