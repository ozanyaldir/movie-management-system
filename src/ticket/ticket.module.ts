import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketController } from './ticket.controller';
import { Movie, MovieSession, Ticket } from 'src/_repository/_entity';
import { TicketRepository } from 'src/_repository';
import { TicketOrchestrator } from './ticket.orchestrator';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, MovieSession, Ticket])],
  controllers: [TicketController],
  providers: [TicketRepository, TicketOrchestrator],
})
export class TicketModule {}
