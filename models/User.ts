import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

const User = mongoose.model('users', userSchema);

export default User;