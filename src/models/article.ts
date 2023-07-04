import mongoose, { model, Types } from "mongoose";

const { Schema } = mongoose;

export interface IArticle {
  _id: Types.ObjectId;
  title: string;
  description: string;
  content: string;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, maxlength: 70 },
    description: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Article = model<IArticle>("Article", ArticleSchema, "articles");
