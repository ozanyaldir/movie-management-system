import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './_entity';

@Injectable()
export class TicketRepository {
  constructor(
    @InjectRepository(Ticket) private repository: Repository<Ticket>,
  ) {}

  async create(m: Ticket): Promise<Ticket> {
    return await this.repository.save(m);
  }

  async setTicketUsed(id: number): Promise<void> {
    await this.repository.update(
      { id },
      {
        isUsed: true,
      },
    );
    return;
  }
}
