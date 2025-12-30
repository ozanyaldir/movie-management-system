import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketController } from './ticket.controller';
import { Movie, MovieSession, Ticket, User } from 'src/_repository/_entity';
import {
  MovieSessionRepository,
  TicketRepository,
  UserRepository,
} from 'src/_repository';
import { TicketOrchestrator } from './ticket.orchestrator';
import { MovieSessionService, TicketService, UserService } from 'src/_service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie, MovieSession, Ticket])],
  controllers: [TicketController],
  providers: [
    UserRepository,
    MovieSessionRepository,
    TicketRepository,
    JwtService,
    UserService,
    MovieSessionService,
    TicketService,
    TicketRepository,
    TicketOrchestrator,
  ],
})
export class TicketModule {}
