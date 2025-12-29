import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(username?: string) {
    super({
      code: 'user_not_found',
      message: username
        ? `User with username "${username}" was not found.`
        : 'User was not found.',
    });
  }
}
