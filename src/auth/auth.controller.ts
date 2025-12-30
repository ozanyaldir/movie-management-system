import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';

import { AuthOrchestrator } from './auth.orchestrator';
import { LoginRequestDTO, RegisterRequestDTO } from './dto/request';
import { AuthResourceDTO } from './dto/resource';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthOrchestrator) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AuthResourceDTO })
  @ApiBadRequestResponse()
  register(@Body() data: RegisterRequestDTO): Promise<AuthResourceDTO> {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthResourceDTO })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  login(@Body() data: LoginRequestDTO): Promise<AuthResourceDTO> {
    return this.authService.login(data);
  }
}
