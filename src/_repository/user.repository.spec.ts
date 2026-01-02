import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './_entity';

describe('UserRepository', () => {
  let repo: UserRepository;
  let ormRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    ormRepo = {
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: ormRepo,
        },
      ],
    }).compile();

    repo = module.get(UserRepository);
  });

  describe('createNewUser', () => {
    it('should save user', async () => {
      const user = new User();
      ormRepo.save.mockResolvedValueOnce(user);

      const result = await repo.createNewUser(user);

      expect(ormRepo.save).toHaveBeenCalledWith(user);
      expect(result).toBe(user);
    });
  });

  describe('updateUser', () => {
    it('should call update with id filter', async () => {
      const user = new User();

      await repo.updateUser(5, user);

      expect(ormRepo.update).toHaveBeenCalledWith({ id: 5 }, user);
    });
  });

  describe('getById', () => {
    it('should call findOne with id condition', async () => {
      await repo.getById(3);

      expect(ormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 3 },
      });
    });
  });

  describe('getByGuid', () => {
    it('should call findOne with guid condition', async () => {
      await repo.getByGuid('abc-guid');

      expect(ormRepo.findOne).toHaveBeenCalledWith({
        where: { guid: 'abc-guid' },
      });
    });
  });

  describe('getByUsername', () => {
    it('should call findOne with username condition', async () => {
      await repo.getByUsername('ozan');

      expect(ormRepo.findOne).toHaveBeenCalledWith({
        where: { username: 'ozan' },
      });
    });
  });
});
