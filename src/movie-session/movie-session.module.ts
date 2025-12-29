import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie, MovieSession } from 'src/_repository/_entity';
import { MovieSessionController } from './movie-session.controller';
import { MovieRepository, MovieSessionRepository } from 'src/_repository';
import { MovieSessionOrchestrator } from './movie-session.orchestrator';
import { MovieService, MovieSessionService } from 'src/_service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieSession, Movie])],
  controllers: [MovieSessionController],
  providers: [
    MovieSessionRepository,
    MovieRepository,
    MovieSessionService,
    MovieService,
    MovieSessionOrchestrator,
  ],
})
export class MovieSessionModule {}
