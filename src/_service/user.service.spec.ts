import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from 'src/_repository';
import { User } from 'src/_repository/_entity';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  const user: User = {
    id: 1,
    guid: 'user-guid',
    username: 'ozan',
  } as unknown as User;

  beforeEach(async () => {
    repository = {
      createNewUser: jest.fn(),
      getById: jest.fn(),
      getByGuid: jest.fn(),
      getByUsername: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('createNewUser', () => {
    it('delegates to repository.createNewUser', async () => {
      repository.createNewUser.mockResolvedValue(user);

      const result = await service.createNewUser(user);

      expect(repository.createNewUser).toHaveBeenCalledWith(user);
      expect(result).toBe(user);
    });
  });

  describe('getPlainById', () => {
    it('delegates to repository.getById', async () => {
      repository.getById.mockResolvedValue(user);

      const result = await service.getPlainById(1);

      expect(repository.getById).toHaveBeenCalledWith(1);
      expect(result).toBe(user);
    });

    it('returns null when repository returns null', async () => {
      repository.getById.mockResolvedValue(null);

      const result = await service.getPlainById(99);

      expect(result).toBeNull();
    });
  });

  describe('getPlainByGuid', () => {
    it('delegates to repository.getByGuid', async () => {
      repository.getByGuid.mockResolvedValue(user);

      const result = await service.getPlainByGuid('user-guid');

      expect(repository.getByGuid).toHaveBeenCalledWith('user-guid');
      expect(result).toBe(user);
    });
  });

  describe('getPlainByUsername', () => {
    it('delegates to repository.getByUsername', async () => {
      repository.getByUsername.mockResolvedValue(user);

      const result = await service.getPlainByUsername('ozan');

      expect(repository.getByUsername).toHaveBeenCalledWith('ozan');
      expect(result).toBe(user);
    });
  });
});
