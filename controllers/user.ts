import {Request, Response} from 'express';
import { createUser } from '../database/user';

export async function register(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const {user: registeredUser, error} = await createUser(username, password);
    if (error) {
      console.log(error);
      return res.status(500).json({user: null, error});
    }
    req.login({username: registeredUser!.username}, err => {
      if (err) return res.status(500).json({user: null, error: err});
      return res.status(201).json({user: registeredUser, error: err});
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({user: null, error: err});
  }
}

export function login(req: Request, res: Response) {
  console.log(req.user);
  return res.status(200).json({user: req.user});
}

export function logout(req: Request, res: Response) {
  req.logout({}, () => {});
  return res.status(200).json(req.user);
}

export function currentUser(req: Request, res: Response) {
  return res.status(200).json(req.user);
}

export default {
  register,
  login,
  logout,
  currentUser,
}
