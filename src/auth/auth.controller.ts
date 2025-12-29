import { Body, Controller, Post } from '@nestjs/common';
import { AuthOrchestrator } from './auth.orchestrator';
import { LoginRequestDTO, RegisterRequestDTO } from './dto/request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthOrchestrator) {}

  @Post('register')
  register(@Body() data: RegisterRequestDTO) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginRequestDTO) {
    return this.authService.login(data);
  }
}
