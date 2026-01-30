import mongoose, { Document, Schema } from "mongoose";

// Purpose: Define the user model schema
export interface UserModel extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
}

const UserSchema = new Schema<UserModel>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<UserModel>("User", UserSchema);
