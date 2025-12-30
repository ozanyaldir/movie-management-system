import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/_repository';
import { User } from 'src/_repository/_entity';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createNewUser(m: User): Promise<User> {
    return await this.repository.createNewUser(m);
  }

  async getPlainById(id: number): Promise<User | null> {
    return await this.repository.getById(id);
  }

  async getPlainByGuid(guid: string): Promise<User | null> {
    return await this.repository.getByGuid(guid);
  }

  async getPlainByUsername(username: string): Promise<User | null> {
    return await this.repository.getByUsername(username);
  }
}
