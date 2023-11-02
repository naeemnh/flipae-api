

import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

import './models/User';
import './models/Employee';
import './services/passport';
import './seed/seed';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/myapp') // provide a default value for MONGO_URI
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.use(express.json());
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY || 'mysecretkey'] // provide a default value for COOKIE_KEY
  })
);
  
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || '3001'; // set default port to 3000 if PORT environment variable is not defined

app.listen(port, () => console.log(`Server running on port ${port}`));