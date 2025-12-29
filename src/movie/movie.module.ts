import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/_repository/_entity';
import { MovieRepository } from 'src/_repository';
import { MovieOrchestrator } from './movie.orchestrator';
import { MovieService } from 'src/_service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController],
  providers: [MovieRepository, MovieService, MovieOrchestrator],
})
export class MovieModule {}
