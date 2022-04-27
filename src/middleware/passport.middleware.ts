import 'dotenv/config';
import consola from 'consola';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { PassportStatic } from 'passport';
import {
    ExtractJwt, Strategy as JwtStrategy, StrategyOptions, VerifiedCallback
} from 'passport-jwt';

import { User } from '../core/users/user.model';

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
          const user = User.findById(payload.user_id).select('username id');

          if (!user) {
            return done(null, false);
          }
          done(null, user);
        } catch (error: any) {
          consola.error(error.message);
        }
      },
    ),
  );
};
