import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

import { AuthOrchestrator } from './auth.orchestrator';
import { LoginRequestDTO, RegisterRequestDTO } from './dto/request';
import { AuthResourceDTO } from './dto/resource';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthOrchestrator) {}

  @Post('register')
  @ApiCreatedResponse({ type: AuthResourceDTO })
  register(@Body() data: RegisterRequestDTO): Promise<AuthResourceDTO> {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthResourceDTO })
  login(@Body() data: LoginRequestDTO): Promise<AuthResourceDTO> {
    return this.authService.login(data);
  }
}
