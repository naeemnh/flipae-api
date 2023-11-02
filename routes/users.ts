import { Router } from 'express';
import passport from 'passport';
import catchAsync from '../utils/catchAsync';
import User from '../models/User';
import users from '../controllers/user';

const router = Router();

router.route('/register')
  .post(catchAsync(users.register));

router.route('/login')
  .post(passport.authenticate('local'), users.login);

router.get('/logout', users.logout);

export default router;
