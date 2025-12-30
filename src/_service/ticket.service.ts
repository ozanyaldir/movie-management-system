import { Injectable } from '@nestjs/common';
import { TicketRepository } from 'src/_repository';
import { Ticket } from 'src/_repository/_entity';

@Injectable()
export class TicketService {
  constructor(private readonly repository: TicketRepository) {}

  async create(m: Ticket): Promise<Ticket> {
    return await this.repository.create(m);
  }

  async update(id: number, m: Ticket): Promise<void> {
    await this.repository.update(id, m);
  }

  async setUsed(id: number): Promise<void> {
    await this.repository.setUsed(id);
  }

  async getPlainByGuid(guid: string): Promise<Ticket | null> {
    return await this.repository.getByGuid(guid);
  }

  async getDetailedByGuid(guid: string): Promise<Ticket | null> {
    return await this.repository.getByGuid(guid, true);
  }

  async list(
    userId: number,
    page: number = 1,
    size: number = 20,
  ): Promise<[Ticket[], number, number, number]> {
    return await this.repository.list(userId, page, size);
  }
}
