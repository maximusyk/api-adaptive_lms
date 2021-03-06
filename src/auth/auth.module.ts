import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from '../tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.register({}),
        ConfigModule,
        UsersModule,
        TokensModule,
    ],
    controllers: [ AuthController ],
    providers: [ AuthService, AccessTokenStrategy, RefreshTokenStrategy ],
})
export class AuthModule {}
