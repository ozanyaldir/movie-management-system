import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/_repository/_entity';
import { MovieRepository, UserRepository } from 'src/_repository';
import { MovieOrchestrator } from './movie.orchestrator';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController],
  providers: [UserRepository, MovieRepository, MovieOrchestrator],
})
export class MovieModule {}
