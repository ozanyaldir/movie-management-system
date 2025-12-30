import { Injectable } from '@nestjs/common';
import { MovieService } from 'src/_service/movie.service';

@Injectable()
export class TicketOrchestrator {
  constructor(private readonly movieService: MovieService) {}
}
