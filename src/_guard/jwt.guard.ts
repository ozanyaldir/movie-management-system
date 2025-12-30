import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'src/_model';
import { UserService } from 'src/_service';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization as string;
      const jwtPayload = this.extractJWTPayload(this.jwtService, token);
      if (!jwtPayload || !jwtPayload.sub) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.getByGuid(jwtPayload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      request.user = user;
      request.sessionId = jwtPayload.session_id;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  extractJWTPayload(service: JwtService, token: string): JWTPayload {
    const secret = process.env.JWT_SECRET;

    const splitToken = token?.split(' ')[1];
    const jwtPayload = service.verify(splitToken, {
      secret,
    });
    if (!jwtPayload) {
      throw new UnauthorizedException();
    }

    return jwtPayload as JWTPayload;
  }
}
