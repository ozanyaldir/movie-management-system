import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './_entity';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createNewUser(m: User): Promise<User> {
    return await this.repository.save(m);
  }

  async getPlainUserByGuid(guid: string): Promise<User | null> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.guid = :guid', { guid: guid })
      .getOne();
  }

  async getPlainUserByUsername(username: string): Promise<User | null> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username })
      .getOne();
  }

  async updateUser(id: number, user: User): Promise<void> {
    await this.repository.update({ id }, user);
    return;
  }
}
