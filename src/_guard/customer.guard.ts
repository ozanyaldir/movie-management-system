import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserType } from 'src/_repository/_entity';

@Injectable()
export class CustomerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const currentUser = req.user as User;

    if (currentUser.type !== UserType.Customer) {
      throw new ForbiddenException();
    }

    return true;
  }
}
