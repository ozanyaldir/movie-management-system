import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDTO, RegisterRequestDTO } from './dto/request';
import { AuthResourceDTO, newAuthResource } from './dto/resource';
import { AuthService } from 'src/_service/auth.service';
import { UserService } from 'src/_service/user.service';
import { newUserFromRegisterRequestDTO } from 'src/_factory/user.factory';

@Injectable()
export class AuthOrchestrator {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async register(data: RegisterRequestDTO): Promise<AuthResourceDTO> {
    const existingUser = await this.userService.getPlainByUsername(
      data.username,
    );
    if (existingUser != null) {
      throw new BadRequestException();
    }

    const passwordHash = await this.authService.hashPassword(data.password);

    const m = newUserFromRegisterRequestDTO(data, passwordHash);
    const createdUser = await this.userService.createNewUser(m);
    const jwt = await this.authService.generateJWT(createdUser);
    return newAuthResource(jwt);
  }

  async login(data: LoginRequestDTO): Promise<AuthResourceDTO> {
    const existingUser = await this.userService.getPlainByUsername(
      data.username,
    );
    if (!existingUser) {
      throw new UnauthorizedException();
    }

    const passwordVerified = await this.authService.verifyPassword(
      data.password,
      existingUser.passwordHash,
    );
    if (!passwordVerified) {
      throw new UnauthorizedException();
    }

    const jwt = await this.authService.generateJWT(existingUser);
    return newAuthResource(jwt);
  }
}
