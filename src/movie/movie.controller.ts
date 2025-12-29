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
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

import { MovieOrchestrator } from './movie.orchestrator';
import {
  CreateMovieRequestDTO,
  ListMoviesRequestDTO,
  UpdateMovieRequestDTO,
} from './dto/request';
import { MovieResourceDTO, PaginatedMovieResourcesDTO } from './dto/resource';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieOrchestrator: MovieOrchestrator) {}

  @Post()
  @ApiCreatedResponse({ type: MovieResourceDTO })
  create(@Body() data: CreateMovieRequestDTO): Promise<MovieResourceDTO> {
    return this.movieOrchestrator.create(data);
  }

  @Put(':id')
  @ApiOkResponse({ type: MovieResourceDTO })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateMovieRequestDTO,
  ): Promise<MovieResourceDTO> {
    return this.movieOrchestrator.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Movie deleted' })
  delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.movieOrchestrator.delete(id);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedMovieResourcesDTO })
  list(
    @Query() query: ListMoviesRequestDTO,
  ): Promise<PaginatedMovieResourcesDTO> {
    return this.movieOrchestrator.list(query);
  }
}
