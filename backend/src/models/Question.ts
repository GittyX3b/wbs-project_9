// models/Product.ts
import { Schema, model, type InferSchemaType } from "mongoose";

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: [true, "question is required"],
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default model("Question", questionSchema);
