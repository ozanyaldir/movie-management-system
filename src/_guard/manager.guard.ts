import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserType } from 'src/_repository/_entity';

@Injectable()
export class ManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const currentUser = req.user as User;

    if (!currentUser || currentUser.type !== UserType.Manager) {
      throw new ForbiddenException();
    }

    return true;
  }
}
