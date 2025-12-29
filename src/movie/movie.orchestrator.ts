import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieResourceDTO, newMovieResourceFromEntity } from './dto/resource';
import { MovieService } from 'src/_service/movie.service';
import { CreateMovieRequestDTO, UpdateMovieRequestDTO } from './dto/request';
import {
  newMovieFromCreateRequestDTO,
  newMovieFromUpdateRequestDTO,
} from 'src/_factory';

@Injectable()
export class MovieOrchestrator {
  constructor(private readonly movieService: MovieService) {}

  async create(data: CreateMovieRequestDTO): Promise<MovieResourceDTO> {
    const m = newMovieFromCreateRequestDTO(data);
    const createdMovie = await this.movieService.create(m);
    return newMovieResourceFromEntity(createdMovie);
  }

  async update(
    id: string,
    data: UpdateMovieRequestDTO,
  ): Promise<MovieResourceDTO> {
    const movie = await this.movieService.getByGuid(id);
    if (!movie) {
      throw new NotFoundException();
    }

    const m = newMovieFromUpdateRequestDTO(data);
    const updatedMovie = await this.movieService.update(movie.id, m);
    if (!updatedMovie) {
      throw new NotFoundException();
    }
    return newMovieResourceFromEntity(updatedMovie);
  }

  async delete(id: string): Promise<void> {
    const movie = await this.movieService.getByGuid(id);
    if (!movie) {
      throw new NotFoundException();
    }

    await this.movieService.delete(movie.id);
  }
}
