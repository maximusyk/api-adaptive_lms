import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtAccessPayload } from './access-token.strategy';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export type JwtRefreshPayload = JwtAccessPayload & {
    refreshToken: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_REFRESH_KEY'),
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtRefreshPayload): any {
        const refreshToken = req.get('Authorization').split(' ')[1];
        return { ...payload, refreshToken };
    }
}