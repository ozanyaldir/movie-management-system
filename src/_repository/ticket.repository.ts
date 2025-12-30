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

  async update(id: number, m: Ticket): Promise<void> {
    await this.repository.update({ id }, m);
  }

  async setUsed(id: number): Promise<void> {
    await this.repository.update(
      { id },
      {
        isUsed: true,
      },
    );
    return;
  }

  async getById(id: number): Promise<Ticket | null> {
    const result = await this.repository.findOne({
      where: { id },
      relations: [],
    });
    return result;
  }

  async getByGuid(guid: string): Promise<Ticket | null> {
    return await this.repository
      .createQueryBuilder('ticket')
      .where('ticket.guid = :guid', { guid: guid })
      .getOne();
  }

  async list(
    userId: number,
    page: number = 1,
    size: number = 20,
  ): Promise<[Ticket[], number, number, number]> {
    const skip = (Number(page) - 1) * Number(size);
    const take = size;

    const [result, total] = await this.repository
      .createQueryBuilder('ticket')
      .where('ticket.userId = :userId', { userId: userId })
      .addOrderBy(`ticket.createdAt`, 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return [result, total, page, size];
  }
}
