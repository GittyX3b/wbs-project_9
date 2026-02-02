import { Router } from 'express';

import { 
  createQuestion,
  getAllQuestions, 
  getQuestionById,
  deleteQuestion
  } from '#controllers';

const questionRouter = Router();

questionRouter.get('/', getAllQuestions)
//validateZod(Schema)
questionRouter.post('/', createQuestion);
questionRouter.get('/:id', getQuestionById);
questionRouter.delete('/:id', deleteQuestion);

export default questionRouter;