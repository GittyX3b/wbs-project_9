import { Router } from 'express';
import { 
  createQuestion,
  getAllQuestions, 
  getQuestionById,
  deleteQuestion
  } from '#controllers';

  import { validateQuestionZod } from '#middlewares';
  import { questionInputSchema } from '#schemas';

const questionRouter = Router();

questionRouter.route('/')
.get(getAllQuestions)
.post(validateQuestionZod(questionInputSchema), createQuestion);
//validateZod(Schema)
questionRouter.route('/:id')
.get(getQuestionById)
.delete(deleteQuestion);

export default questionRouter;