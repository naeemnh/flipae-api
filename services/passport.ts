import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt';

import User from '../models/User';

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

const params: StrategyOptions = {
  secretOrKey: process.env.COOKIE_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}


passport.use(new JWTStrategy(params, function(payload, done) {

  if(payload.expire <= Date.now())
    return done(new Error("TokenExpired"), false);

  User.findById(payload.id)
    .then(user =>  user ? done(null, user) : done(new Error("UserNotFound"), false))
    .catch(err => done(err, false))
}))

passport.use(new LocalStrategy(User.authenticate()));

