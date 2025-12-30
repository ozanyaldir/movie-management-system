import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie, MovieSession, User } from 'src/_repository/_entity';
import { MovieSessionController } from './movie-session.controller';
import {
  MovieRepository,
  MovieSessionRepository,
  UserRepository,
} from 'src/_repository';
import { MovieSessionOrchestrator } from './movie-session.orchestrator';
import { MovieService, MovieSessionService, UserService } from 'src/_service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, MovieSession, Movie])],
  controllers: [MovieSessionController],
  providers: [
    UserRepository,
    MovieSessionRepository,
    MovieRepository,
    JwtService,
    UserService,
    MovieSessionService,
    MovieService,
    MovieSessionOrchestrator,
  ],
})
export class MovieSessionModule {}
