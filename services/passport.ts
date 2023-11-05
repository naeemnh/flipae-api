import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';

import User from '../models/User';

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user: any) => {
    console.log(user);
    done(null, user);
  }).catch((err: Error) => {
    done(err, null);
  })
});


passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username: string, password: string, done) => {
    console.log(username, password);
    // Match user
    User.findOne({ username: username }).then((user: any) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect Username' });
      }

      // Match password
      bcrypt.compare(password, user.password, (err: Error | null, isMatch: boolean) => {
        if (err) throw err;

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    });
  }
));