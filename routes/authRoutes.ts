import { Router } from 'express';
import passport from 'passport';
import catchAsync from '../utils/catchAsync';
import users from '../controllers/user';

const router = Router();

router.post('/register', users.register);

router.post('/login', passport.authenticate('local'), users.login);

router.route('/')
  .get(users.currentUser)
  .delete(users.logout);


export default router;
