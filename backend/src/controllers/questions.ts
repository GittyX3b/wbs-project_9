import { type RequestHandler } from "express";
import { Question } from "#models";

// import type { userInputSchema, userSchema } from "#schemas";
// import { z } from "zod/v4";
// type UserInputDTO = z.infer<typeof userInputSchema>;
// type UserDTO = z.infer<typeof userSchema>;


export const getAllQuestions: RequestHandler<{}
//, UserDTO[]
> = async (req, res) => {
  const qustions = await Question.find();
  res.json(qustions);
};

export const createQuestion: RequestHandler<{}
//, UserDTO, UserInputDTO
> = async (
  req,
  res
) => {
  const question = await Question.create(req.body);
  res.json(question);
};

export const getQuestionById: RequestHandler<{ id: string }
// , UserDTO
> = async (req,res) => {
  const {params: { id }} = req;
  const question = await Question.findById(id);
  if (!question) throw new Error("Question not found", { cause: 404 });
  res.json(question);
};

export const deleteQuestion: RequestHandler<{ id: string }> = async (req, res) => {
  const {params: { id },} = req;
  const question = await Question.findByIdAndDelete(id);
  if (!question) throw new Error("User not found", { cause: 404 });
  res.status(204).send();
};