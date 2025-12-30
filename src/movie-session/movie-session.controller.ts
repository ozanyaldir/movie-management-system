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
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

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

@ApiTags('sessions')
@Controller('sessions')
export class MovieSessionController {
  constructor(
    private readonly movieSessionOrchestrator: MovieSessionOrchestrator,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: MovieSessionResourceDTO })
  @ApiNotFoundResponse({
    description: 'Movie not found',
  })
  create(
    @Body() data: CreateMovieSessionRequestDTO,
  ): Promise<MovieSessionResourceDTO> {
    return this.movieSessionOrchestrator.create(data);
  }

  @Put(':id')
  @ApiOkResponse({ type: MovieSessionResourceDTO })
  @ApiNotFoundResponse({
    description: 'Movie session not found',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateMovieSessionRequestDTO,
  ): Promise<MovieSessionResourceDTO> {
    return this.movieSessionOrchestrator.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Session deleted' })
  @ApiNotFoundResponse({
    description: 'Movie session not found',
  })
  delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.movieSessionOrchestrator.delete(id);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedMovieSessionResourcesDTO })
  @ApiNotFoundResponse({
    description: 'Movie not found',
  })
  list(
    @Query() query: ListMovieSessionsRequestDTO,
  ): Promise<PaginatedMovieSessionResourcesDTO> {
    return this.movieSessionOrchestrator.list(query);
  }
}
