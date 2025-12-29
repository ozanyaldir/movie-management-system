import { NotFoundException } from '@nestjs/common';

export class MovieNotFoundException extends NotFoundException {
  constructor(guid?: string) {
    super({
      code: 'movie_not_found',
      message: guid
        ? `Movie with guid "${guid}" was not found.`
        : 'Movie was not found.',
    });
  }
}
