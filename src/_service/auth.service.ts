import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/_repository/_entity';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { newJWTPayload } from 'src/_model';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, 12);
  }

  async verifyPassword(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, passwordHash);
  }

  async generateJWT(user: User): Promise<string> {
    const sessionId = uuidv4();
    const jwtPayload = newJWTPayload(user.guid, user.type, sessionId);

    return await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1w',
    });
  }
}
