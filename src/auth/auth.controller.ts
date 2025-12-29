import { Body, Controller, Post } from '@nestjs/common';
import { AuthOrchestrator } from './auth.orchestrator';
import { LoginRequestDTO, RegisterRequestDTO } from './dto/request';
import { AuthResourceDTO } from './dto/resource';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthOrchestrator) {}

  @Post('register')
  register(@Body() data: RegisterRequestDTO): Promise<AuthResourceDTO> {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginRequestDTO): Promise<AuthResourceDTO> {
    return this.authService.login(data);
  }
}
