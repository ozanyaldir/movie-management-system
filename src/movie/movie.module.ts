import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie, User } from 'src/_repository/_entity';
import { MovieRepository, UserRepository } from 'src/_repository';
import { MovieOrchestrator } from './movie.orchestrator';
import { MovieService, UserService } from 'src/_service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie])],
  controllers: [MovieController],
  providers: [
    UserRepository,
    MovieRepository,
    JwtService,
    UserService,
    MovieService,
    MovieOrchestrator,
  ],
})
export class MovieModule {}
