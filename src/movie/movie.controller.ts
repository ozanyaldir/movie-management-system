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
import { MovieOrchestrator } from './movie.orchestrator';
import {
  CreateMovieRequestDTO,
  ListMoviesRequestDTO,
  UpdateMovieRequestDTO,
} from './dto/request';
import { MovieResourceDTO, PaginatedMovieResourcesDTO } from './dto/resource';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieOrchestrator: MovieOrchestrator) {}

  @Post()
  create(@Body() data: CreateMovieRequestDTO): Promise<MovieResourceDTO> {
    return this.movieOrchestrator.create(data);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateMovieRequestDTO,
  ): Promise<MovieResourceDTO> {
    return this.movieOrchestrator.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.movieOrchestrator.delete(id);
  }

  @Get()
  list(
    @Query() query: ListMoviesRequestDTO,
  ): Promise<PaginatedMovieResourcesDTO> {
    return this.movieOrchestrator.list(query);
  }
}
