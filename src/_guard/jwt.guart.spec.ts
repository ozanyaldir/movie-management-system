import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTGuard } from './jwt.guard';
import { UserService } from 'src/_service';
import { User } from 'src/_repository/_entity';

describe('JWTGuard', () => {
  let guard: JWTGuard;
  let jwtService: jest.Mocked<JwtService>;
  let userService: jest.Mocked<UserService>;

  const mockHttpContext = (req: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
    }) as any;

  beforeEach(() => {
    jwtService = {
      verify: jest.fn(),
    } as any;

    userService = {
      getPlainByGuid: jest.fn(),
    } as any;

    guard = new JWTGuard(jwtService, userService);

    process.env.JWT_SECRET = 'test-secret';
  });

  describe('canActivate', () => {
    it('allows access when token is valid and user exists', async () => {
      const req: any = {
        headers: { authorization: 'Bearer valid.token' },
      };

      const user = new User();
      user.guid = 'user-guid';

      jwtService.verify.mockReturnValueOnce({
        sub: 'user-guid',
        session_id: 'session-123',
      });

      userService.getPlainByGuid.mockResolvedValueOnce(user);

      const ctx = mockHttpContext(req);

      const result = await guard.canActivate(ctx);

      expect(result).toBe(true);
      expect(req.user).toBe(user);
      expect(req.sessionId).toBe('session-123');

      expect(jwtService.verify).toHaveBeenCalledWith('valid.token', {
        secret: 'test-secret',
      });

      expect(userService.getPlainByGuid).toHaveBeenCalledWith('user-guid');
    });

    it('throws UnauthorizedException when payload has no sub', async () => {
      const req: any = {
        headers: { authorization: 'Bearer bad.token' },
      };

      jwtService.verify.mockReturnValueOnce({
        session_id: 'abc',
      });

      const ctx = mockHttpContext(req);

      await expect(guard.canActivate(ctx)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      const req: any = {
        headers: { authorization: 'Bearer valid.token' },
      };

      jwtService.verify.mockReturnValueOnce({
        sub: 'ghost-user',
        session_id: 'sess',
      });

      userService.getPlainByGuid.mockResolvedValueOnce(null);

      const ctx = mockHttpContext(req);

      await expect(guard.canActivate(ctx)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when jwt.verify throws', async () => {
      const req: any = {
        headers: { authorization: 'Bearer invalid.token' },
      };

      jwtService.verify.mockImplementation(() => {
        throw new Error('bad token');
      });

      const ctx = mockHttpContext(req);

      await expect(guard.canActivate(ctx)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when Authorization header missing', async () => {
      const req: any = { headers: {} };

      const ctx = mockHttpContext(req);

      await expect(guard.canActivate(ctx)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('extractJWTPayload', () => {
    it('extracts and verifies token successfully', () => {
      jwtService.verify.mockReturnValueOnce({
        sub: 'abc',
      });

      const result = guard.extractJWTPayload(
        jwtService,
        'Bearer test.jwt.value',
      );

      expect(jwtService.verify).toHaveBeenCalledWith('test.jwt.value', {
        secret: 'test-secret',
      });

      expect(result.sub).toBe('abc');
    });

    it('throws UnauthorizedException when verify returns null', () => {
      jwtService.verify.mockReturnValueOnce(undefined as any);

      expect(() => guard.extractJWTPayload(jwtService, 'Bearer x.y.z')).toThrow(
        UnauthorizedException,
      );
    });
  });
});
