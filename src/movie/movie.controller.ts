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

import { MovieOrchestrator } from './movie.orchestrator';
import {
  CreateMovieRequestDTO,
  ListMoviesRequestDTO,
  UpdateMovieRequestDTO,
} from './dto/request';
import { PaginatedMovieResourcesDTO } from './dto/resource';
import { JWTGuard, ManagerGuard } from 'src/_guard';
import { MovieResourceDTO } from 'src/_shared/dto/resource';

@ApiTags('movies')
@Controller('movies')
@UseGuards(JWTGuard)
export class MovieController {
  constructor(private readonly movieOrchestrator: MovieOrchestrator) {}

  @Post()
  @UseGuards(ManagerGuard)
  @ApiCreatedResponse({ type: MovieResourceDTO })
  create(@Body() data: CreateMovieRequestDTO): Promise<MovieResourceDTO> {
    return this.movieOrchestrator.create(data);
  }

  @Put(':id')
  @UseGuards(ManagerGuard)
  @ApiOkResponse({ type: MovieResourceDTO })
  @ApiNotFoundResponse({
    description: 'Movie not found',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateMovieRequestDTO,
  ): Promise<MovieResourceDTO> {
    return this.movieOrchestrator.update(id, data);
  }

  @Delete(':id')
  @UseGuards(ManagerGuard)
  @ApiOkResponse({ description: 'Movie deleted' })
  @ApiNotFoundResponse({
    description: 'Movie not found',
  })
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
