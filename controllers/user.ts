import {Request, Response} from 'express';
import { Document } from 'mongoose';
import jwt from 'jwt-simple';

import User from '../models/User';

/**
 * POST /auth/register
 * Create a new local account.
 * @param req.body.username
 * @param req.body.password
 */
export function register(req: Request, res: Response): void {
  const { username, password } = req.body;
  User.register(new User({username}), password, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({token: null, error: err});
    }
    req.login(user, err => {
      if (err) return res.status(500).json({token: null, error: err});
      
      const payload = { 
        id: user._id, 
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7 
      }
      var token = jwt.encode(payload, process.env.COOKIE_KEY!)

      return res.json({ token: token, error: null })
    })
  });
}

/**
 * POST /auth/login
 * Sign in using email and password.
 * @param req.body.username
 * @param req.body.password
 */
export function login(req: Request, res: Response) {
  const user = req.user as Document<typeof User>;
  const payload = {
    id: user._id,
    expire: Date.now() + 1000 * 60 * 60 * 24 * 7
  }
  var token = jwt.encode(payload, process.env.COOKIE_KEY!)

  return res.status(201).json({ token: token, error: null, user })
}

/**
 * DELETE /auth/
 * Log out.
 */
export function logout(req: Request, res: Response) {
  req.logout({}, () => {});
  return res.status(200).json(req.user);
}

/**
 * GET /auth/
 * Return the current user
 */
export function currentUser(req: Request, res: Response) {
  try {
    if (!req.user) throw new Error('No user');
    return res.status(200).json(req.user);
  } catch(err) {
    return res.status(500).json({user: null, error: err});
  }
}

export default {
  register,
  login,
  logout,
  currentUser,
}
