import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MovieSessionOrchestrator } from './movie-session.orchestrator';
import {
  CreateMovieSessionRequestDTO,
  ListMovieSessionsRequestDTO,
  UpdateMovieSessionRequestDTO,
} from './dto/request';
import {
  MovieSessionResourceDTO,
  PaginatedMovieSessionResourcesDTO,
} from './dto/resource';
@Controller('sessions')
export class MovieSessionController {
  constructor(
    private readonly movieSessionOrchestrator: MovieSessionOrchestrator,
  ) {}

  @Post()
  create(
    @Body() data: CreateMovieSessionRequestDTO,
  ): Promise<MovieSessionResourceDTO> {
    return this.movieSessionOrchestrator.create(data);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateMovieSessionRequestDTO,
  ): Promise<MovieSessionResourceDTO> {
    return this.movieSessionOrchestrator.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.movieSessionOrchestrator.delete(id);
  }

  @Get()
  list(
    @Query() query: ListMovieSessionsRequestDTO,
  ): Promise<PaginatedMovieSessionResourcesDTO> {
    return this.movieSessionOrchestrator.list(query);
  }
}
