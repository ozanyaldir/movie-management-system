import { NotFoundException } from '@nestjs/common';

export class MovieSessionNotFoundException extends NotFoundException {
  constructor(guid?: string) {
    super({
      code: 'movie_session_not_found',
      message: guid
        ? `Movie session with guid "${guid}" was not found.`
        : 'Movie session was not found.',
    });
  }
}
