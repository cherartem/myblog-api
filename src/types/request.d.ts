import { Types } from "mongoose";
import { Request } from "express";

export interface Payload {
  userId: Types.ObjectId;
}

export interface AuthenticatedRequest extends Request {
  user?: Payload;
}
