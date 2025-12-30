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

  async getById(id: number, detailed: boolean = false): Promise<Ticket | null> {
    const relations = ['session', 'movie'];
    return await this.repository.findOne({
      where: { id },
      relations: detailed ? relations : [],
    });
  }

  async getByGuid(
    guid: string,
    detailed: boolean = false,
  ): Promise<Ticket | null> {
    const relations = ['session', 'movie'];
    return await this.repository.findOne({
      where: { guid },
      relations: detailed ? relations : [],
    });
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
      .leftJoinAndSelect('ticket.session', 'session')
      .leftJoinAndSelect('session.movie', 'movie')
      .addOrderBy(`ticket.createdAt`, 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return [result, total, page, size];
  }
}
