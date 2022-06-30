import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { RoleEnum } from '../../roles/enums/role.enum';

export type JwtAccessPayload = {
    sub: string,
    email: string,
    role: RoleEnum,
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_ACCESS_KEY,
        });
    }

    validate(payload: JwtAccessPayload) {
        return payload;
    }
}