import {Request, Response} from 'express';
import User from '../models/User';
import { createUser } from '../database/user';

export default {
  register: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const {username: registeredUser} = await createUser(username, password)
      req.login(registeredUser, err => {
        if (err) return res.status(500).json(err);
        return res.status(201).json(registeredUser);
      })
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  login: async (req: Request, res: Response) => {
    return res.status(200).json(req.user);
  },
  logout: (req: Request, res: Response) => {
    req.logout({}, () => {});
    return res.status(200).json(req.user);
  }
}
