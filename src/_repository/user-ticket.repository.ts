import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTicket } from './_entity';

@Injectable()
export class UserTicketRepository {
  constructor(
    @InjectRepository(UserTicket) private repository: Repository<UserTicket>,
  ) {}

  async createNewUserTicket(m: UserTicket): Promise<UserTicket> {
    return await this.repository.save(m);
  }

  async setUserTicketUsed(id: number): Promise<void> {
    await this.repository.update(
      { id },
      {
        isUsed: true,
      },
    );
    return;
  }
}
