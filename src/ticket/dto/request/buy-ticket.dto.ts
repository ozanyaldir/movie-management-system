import { IsUUID } from 'class-validator';

export class BuyTicketRequestDTO {
  @IsUUID('4')
  session_id: string;
}
