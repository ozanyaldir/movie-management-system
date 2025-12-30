import { Injectable } from '@nestjs/common';
import {
  MovieResourceDTO,
  newMovieResourceFromEntity,
  newPaginatedMovieResourceDTO,
  PaginatedMovieResourcesDTO,
} from './dto/resource';
import { MovieService } from 'src/_service';
import {
  CreateMovieRequestDTO,
  ListMoviesRequestDTO,
  UpdateMovieRequestDTO,
} from './dto/request';
import {
  newMovieFromCreateRequestDTO,
  newMovieFromUpdateRequestDTO,
} from 'src/_factory';
import { MovieNotFoundException } from 'src/_exception';

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
      throw new MovieNotFoundException(id);
    }

    const m = newMovieFromUpdateRequestDTO(data);
    await this.movieService.update(movie.id, m);

    const updatedMovie = await this.movieService.getByGuid(id);
    if (!updatedMovie) {
      throw new MovieNotFoundException(id);
    }
    return newMovieResourceFromEntity(updatedMovie);
  }

  async delete(id: string): Promise<void> {
    const movie = await this.movieService.getByGuid(id);
    if (!movie) {
      throw new MovieNotFoundException(id);
    }

    await this.movieService.delete(movie.id);
  }

  async list(query: ListMoviesRequestDTO): Promise<PaginatedMovieResourcesDTO> {
    const [result, total, page, size] = await this.movieService.list(
      query.page,
      query.size,
    );

    return newPaginatedMovieResourceDTO(result, total, page, size);
  }
}
