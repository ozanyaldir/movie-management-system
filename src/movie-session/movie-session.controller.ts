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
  UseGuards,
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
import { PaginatedMovieSessionResourcesDTO } from './dto/resource';
import { JWTGuard, ManagerGuard } from 'src/_guard';
import { MovieSessionResourceDTO } from 'src/_shared/dto/resource';

@ApiTags('sessions')
@Controller('sessions')
@UseGuards(JWTGuard)
export class MovieSessionController {
  constructor(
    private readonly movieSessionOrchestrator: MovieSessionOrchestrator,
  ) {}

  @Post()
  @UseGuards(ManagerGuard)
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
  @UseGuards(ManagerGuard)
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
  @UseGuards(ManagerGuard)
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
