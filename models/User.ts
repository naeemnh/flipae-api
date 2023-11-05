import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";


  const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('users', userSchema);

export default User;