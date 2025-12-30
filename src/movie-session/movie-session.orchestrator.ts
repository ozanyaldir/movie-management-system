import { Injectable } from '@nestjs/common';
import {
  CreateMovieSessionRequestDTO,
  ListMovieSessionsRequestDTO,
  UpdateMovieSessionRequestDTO,
} from './dto/request';
import {
  newPaginatedMovieSessionResourceDTO as newPaginatedMovieSessionResourceDTO,
  PaginatedMovieSessionResourcesDTO,
} from './dto/resource';
import { MovieService, MovieSessionService } from 'src/_service';
import {
  newMovieSessionFromCreateRequestDTO,
  newMovieSessionFromUpdateRequestDTO,
} from 'src/_factory';
import {
  MovieNotFoundException,
  MovieSessionNotFoundException,
} from 'src/_exception';
import {
  MovieSessionResourceDTO,
  newMovieSessionResourceFromEntity,
} from 'src/_shared/dto/resource';
@Injectable()
export class MovieSessionOrchestrator {
  constructor(
    private readonly movieSessionService: MovieSessionService,
    private readonly movieService: MovieService,
  ) {}

  async create(
    data: CreateMovieSessionRequestDTO,
  ): Promise<MovieSessionResourceDTO> {
    const movie = await this.movieService.getByGuid(data.movie_id);
    if (!movie) {
      throw new MovieNotFoundException(data.movie_id);
    }

    const m = newMovieSessionFromCreateRequestDTO(data, movie);
    const createdMovieSession = await this.movieSessionService.create(m);

    const detailedMovieSession = await this.movieSessionService.getByGuid(
      createdMovieSession.guid,
    );
    if (!detailedMovieSession) {
      throw new MovieSessionNotFoundException(createdMovieSession.guid);
    }
    return newMovieSessionResourceFromEntity(detailedMovieSession);
  }

  async update(
    id: string,
    data: UpdateMovieSessionRequestDTO,
  ): Promise<MovieSessionResourceDTO> {
    const existingMovieSession = await this.movieSessionService.getByGuid(id);
    if (!existingMovieSession) {
      throw new MovieSessionNotFoundException(id);
    }

    const m = newMovieSessionFromUpdateRequestDTO(data);
    await this.movieSessionService.update(existingMovieSession.id, m);

    const updatedMovieSession = await this.movieSessionService.getByGuid(
      existingMovieSession.guid,
    );
    if (!updatedMovieSession) {
      throw new MovieSessionNotFoundException(id);
    }
    return newMovieSessionResourceFromEntity(updatedMovieSession);
  }

  async delete(id: string): Promise<void> {
    const movieSession = await this.movieSessionService.getByGuid(id);
    if (!movieSession) {
      throw new MovieSessionNotFoundException(id);
    }

    await this.movieSessionService.delete(movieSession.id);
  }

  async list(
    query: ListMovieSessionsRequestDTO,
  ): Promise<PaginatedMovieSessionResourcesDTO> {
    const movie = await this.movieService.getByGuid(query.movie_id);
    if (!movie) {
      throw new MovieNotFoundException(query.movie_id);
    }

    const [result, total, page, size] = await this.movieSessionService.list(
      movie.id,
      query.page,
      query.size,
    );

    return newPaginatedMovieSessionResourceDTO(result, total, page, size);
  }
}
