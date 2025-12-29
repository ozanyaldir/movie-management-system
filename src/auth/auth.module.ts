import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthOrchestrator } from './auth.orchestrator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/_repository/_entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/_service/auth.service';
import { UserService } from 'src/_service/user.service';
import { UserRepository } from 'src/_repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    UserRepository,
    JwtService,
    AuthService,
    UserService,
    AuthOrchestrator,
  ],
})
export class AuthModule {}
