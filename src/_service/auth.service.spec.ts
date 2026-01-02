import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { newJWTPayload } from 'src/_model';
import { User } from 'src/_repository/_entity';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    jwtService = {
      signAsync: jest.fn(),
    } as any;

    (uuidv4 as jest.Mock).mockReturnValue('session-123');

    process.env.JWT_SECRET = 'test-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: jwtService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('hashPassword', () => {
    it('hashes password using bcrypt with 12 salt rounds', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pass');

      const result = await service.hashPassword('plain');

      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 12);
      expect(result).toBe('hashed-pass');
    });
  });

  describe('verifyPassword', () => {
    it('compares password and hash using bcrypt', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyPassword('plain', 'hashed');

      expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
      expect(result).toBe(true);
    });
  });

  describe('generateJWT', () => {
    it('creates payload with session id and signs JWT', async () => {
      const user = {
        guid: 'user-guid',
        type: 'member',
      } as unknown as User;

      (newJWTPayload as jest.Mock).mockReturnValue({
        sub: 'user-guid',
        user_type: 'member',
        session_id: 'session-123',
      });

      jwtService.signAsync.mockResolvedValue('signed-token');

      const token = await service.generateJWT(user);

      expect(uuidv4).toHaveBeenCalled();

      expect(newJWTPayload).toHaveBeenCalledWith(
        'user-guid',
        'member',
        'session-123',
      );

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: 'user-guid',
          user_type: 'member',
          session_id: 'session-123',
        },
        {
          secret: 'test-secret',
          expiresIn: '1w',
        },
      );

      expect(token).toBe('signed-token');
    });
  });
});
