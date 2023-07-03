import mongoose, { model, Types } from "mongoose";

const { Schema } = mongoose;

export interface IUser {
  _id: Types.ObjectId;
  fullname: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = model<IUser>("User", UserSchema, "users");
