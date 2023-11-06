import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieSession from 'cookie-session';
// import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

require('dotenv').config();

import './services/passport';
import employeeRoutes from './routes/employeeRoutes';
import authRoutes from './routes/authRoutes';

// Seed Data
// import './seed/seed';

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myapp') // provide a default value for MONGO_URI
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY || 'mysecretkey'],
     // provide a default value for COOKIE_KEY
  })
);
  
app.use(passport.initialize());
app.use(passport.session());

app.use('/employees', employeeRoutes);
app.use('/auth', authRoutes);

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || '3001'; // set default port to 3001 if PORT environment variable is not defined

app.listen(port, () => console.log(`Server running on port ${port}`));