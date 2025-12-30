import { Injectable } from '@nestjs/common';
import {
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
import {
  MovieResourceDTO,
  newMovieResourceFromEntity,
} from 'src/_shared/dto/resource';

@Injectable()
export class MovieOrchestrator {
  constructor(private readonly movieService: MovieService) {}

  async create(data: CreateMovieRequestDTO): Promise<MovieResourceDTO> {
    const m = newMovieFromCreateRequestDTO(data);
    const createdMovie = await this.movieService.create(m);

    const updatedMovie = await this.movieService.getDetailedByGuid(
      createdMovie.guid,
    );
    if (!updatedMovie) {
      throw new MovieNotFoundException(createdMovie.guid);
    }
    return newMovieResourceFromEntity(updatedMovie);
  }

  async update(
    id: string,
    data: UpdateMovieRequestDTO,
  ): Promise<MovieResourceDTO> {
    const movie = await this.movieService.getPlainByGuid(id);
    if (!movie) {
      throw new MovieNotFoundException(id);
    }

    const m = newMovieFromUpdateRequestDTO(data);
    await this.movieService.update(movie.id, m);

    const updatedMovie = await this.movieService.getDetailedById(movie.id);
    if (!updatedMovie) {
      throw new MovieNotFoundException(id);
    }
    return newMovieResourceFromEntity(updatedMovie);
  }

  async delete(id: string): Promise<void> {
    const movie = await this.movieService.getPlainByGuid(id);
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
