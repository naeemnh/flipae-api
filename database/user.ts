import User from '../models/User';
import bcrypt from 'bcryptjs';

export async function createUser(username: string, password: string) {
  try {
    const user = new User({ username });
    const encryptedPassword = bcrypt.hashSync(password, 10);
    user.password = encryptedPassword;
    await user.save();
    return {user: {...user}, error: null }
  } catch(err) {
    console.log(err, 'in database')
    return { user: null, error: err }
  }
}