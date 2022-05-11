import consola from 'consola';
import 'dotenv/config';
import { JwtPayload } from 'jsonwebtoken';
import { PassportStatic } from 'passport';
import {
    ExtractJwt,
    Strategy as JwtStrategy,
    StrategyOptions,
    VerifiedCallback,
} from 'passport-jwt';
import { User } from '../core/users/entities/user.entity';

const jwt = process.env.JWT_SECRET_KEY as string;

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwt,
};

export default (passport: PassportStatic) => {
    passport.use(
        new JwtStrategy(
            options,
            async (payload: JwtPayload, done: VerifiedCallback) => {
                try {
                    const user = User.findById(payload.user_id).select(
                        'username id',
                    );

                    if (!user) {
                        return done(null, false);
                    }
                    done(null, user);
                } catch (error: Error | unknown) {
                    consola.error(
                        error instanceof Error ? error.message : error,
                    );
                }
            },
        ),
    );
};
