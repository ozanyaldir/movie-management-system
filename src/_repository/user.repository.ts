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

  async updateUser(id: number, m: User): Promise<void> {
    await this.repository.update({ id }, m);
    return;
  }

  async getByGuid(guid: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { guid },
    });
  }

  async getByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { username },
    });
  }
}
