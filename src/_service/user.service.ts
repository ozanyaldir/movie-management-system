import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/_repository';
import { User } from 'src/_repository/_entity';
import { RegisterRequestDTO } from 'src/auth/dto/request';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createNewUser(m: User): Promise<User> {
    return await this.repository.createNewUser(m);
  }

  async getPlainUserByGuid(guid: string): Promise<User | null> {
    return await this.repository.getPlainUserByGuid(guid);
  }

  async getPlainUserByUsername(username: string): Promise<User | null> {
    return await this.repository.getPlainUserByUsername(username);
  }
}
