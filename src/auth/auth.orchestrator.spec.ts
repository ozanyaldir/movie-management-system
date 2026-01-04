import { AuthOrchestrator } from './auth.orchestrator';
import { AuthService } from 'src/_service/auth.service';
import { UserService } from 'src/_service/user.service';
import { LoginRequestDTO, RegisterRequestDTO } from './dto/request';
import { newUserFromRegisterRequestDTO } from 'src/_factory/user.factory';
import { AuthResourceDTO } from './dto/resource';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

jest.mock('src/_factory/user.factory', () => ({
  newUserFromRegisterRequestDTO: jest.fn(),
}));

describe('AuthOrchestrator', () => {
  let orchestrator: AuthOrchestrator;
  let authService: jest.Mocked<AuthService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    authService = {
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
      generateJWT: jest.fn(),
    } as any;

    userService = {
      getPlainByUsername: jest.fn(),
      createNewUser: jest.fn(),
    } as any;

    orchestrator = new AuthOrchestrator(authService, userService);
  });

  describe('register', () => {
    it('should register user and return auth resource', async () => {
      const dto = new RegisterRequestDTO();
      dto.username = 'ozan';
      dto.password = 'password123';

      userService.getPlainByUsername.mockResolvedValue(null);

      authService.hashPassword.mockResolvedValue('hash123');

      const userEntity = { id: 1 } as any;
      (newUserFromRegisterRequestDTO as jest.Mock).mockReturnValue(userEntity);

      const createdUser = { id: 1, guid: 'u1' } as any;
      userService.createNewUser.mockResolvedValue(createdUser);

      authService.generateJWT.mockResolvedValue('jwt-token');

      const result = await orchestrator.register(dto);

      expect(userService.getPlainByUsername).toHaveBeenCalledWith('ozan');
      expect(authService.hashPassword).toHaveBeenCalledWith('password123');
      expect(newUserFromRegisterRequestDTO).toHaveBeenCalledWith(
        dto,
        'hash123',
      );
      expect(userService.createNewUser).toHaveBeenCalledWith(userEntity);
      expect(authService.generateJWT).toHaveBeenCalledWith(createdUser);

      expect(result).toBeInstanceOf(AuthResourceDTO);
      expect(result.token).toBe('jwt-token');
    });

    it('should throw BadRequestException when username already exists', async () => {
      const dto = new RegisterRequestDTO();
      dto.username = 'ozan';

      userService.getPlainByUsername.mockResolvedValue({ id: 1 } as any);

      await expect(orchestrator.register(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should login and return auth resource', async () => {
      const dto = new LoginRequestDTO();
      dto.username = 'ozan';
      dto.password = 'pass1234';

      const user = { id: 1, passwordHash: 'hash' } as any;
      userService.getPlainByUsername.mockResolvedValue(user);

      authService.verifyPassword.mockResolvedValue(true);
      authService.generateJWT.mockResolvedValue('jwt-token');

      const result = await orchestrator.login(dto);

      expect(userService.getPlainByUsername).toHaveBeenCalledWith('ozan');
      expect(authService.verifyPassword).toHaveBeenCalledWith(
        'pass1234',
        'hash',
      );
      expect(authService.generateJWT).toHaveBeenCalledWith(user);

      expect(result).toBeInstanceOf(AuthResourceDTO);
      expect(result.token).toBe('jwt-token');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const dto = new LoginRequestDTO();
      dto.username = 'missing';

      userService.getPlainByUsername.mockResolvedValue(null);

      await expect(orchestrator.login(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const dto = new LoginRequestDTO();
      dto.username = 'ozan';
      dto.password = 'wrong';

      userService.getPlainByUsername.mockResolvedValue({
        id: 1,
        passwordHash: 'hash',
      } as any);

      authService.verifyPassword.mockResolvedValue(false);

      await expect(orchestrator.login(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});
