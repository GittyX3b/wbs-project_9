import { type RequestHandler } from "express";
import { Question } from "#models";
import { z } from "zod/v4";
import type { questionInputSchema, questionSchema } from "#schemas";

//create a type from our schema
//Data Transfer Object (DTO)
type QuestionInputDTO = z.infer<typeof questionInputSchema>;
type QuestionDTO = z.infer<typeof questionSchema>;

	
//RequestHandler<Params, ResBody, ReqBody, ReqQuery>
export const getAllQuestions: RequestHandler<{}, QuestionDTO[]> = async (req, res) => {
  const qustions = await Question.find();
  res.json(qustions);
};

export const createQuestion: RequestHandler<{}, QuestionDTO, QuestionInputDTO> = async (req,res) => {
  const question = await Question.create(req.body);
  res.status(201).json(question);
};

export const getQuestionById: RequestHandler<{ id: string }, QuestionDTO> = async (req,res) => {
  const {params: { id }} = req;
  const question = await Question.findById(id);
  if (!question) throw new Error("Question not found", { cause: 404 });
  res.json(question);
};

export const deleteQuestion: RequestHandler<{ id: string }> = async (req, res) => {
  const {params: { id },} = req;
  const question = await Question.findByIdAndDelete(id);
  if (!question) throw new Error("Question not found", { cause: 404 });
  res.status(204).send();
};