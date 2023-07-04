import { Types } from "mongoose";
import { Request } from "express";

export interface Payload {
  userId: Types.ObjectId;
  tokenVersion?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: Payload;
}
