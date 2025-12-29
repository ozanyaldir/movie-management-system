import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { MovieOrchestrator } from './movie.orchestrator';
import { CreateMovieRequestDTO, UpdateMovieRequestDTO } from './dto/request';
import { MovieResourceDTO } from './dto/resource';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieOrchestrator: MovieOrchestrator) {}

  @Post('create')
  create(@Body() data: CreateMovieRequestDTO): Promise<MovieResourceDTO> {
    return this.movieOrchestrator.create(data);
  }

  @Put('update/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateMovieRequestDTO,
  ): Promise<MovieResourceDTO> {
    return this.movieOrchestrator.update(id, data);
  }

  @Delete('update/:id')
  delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.movieOrchestrator.delete(id);
  }
}
