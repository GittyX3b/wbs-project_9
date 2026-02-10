import { Router } from 'express';
import { geminiSdkStructured } from '#services';
import { validateZod } from '#middlewares';
import { aiToolsPromptBodySchema } from '#schemas';

const completionsRouter = Router();
completionsRouter.use(validateZod(aiToolsPromptBodySchema));

//completionsRouter.post('/', createCompletion);
completionsRouter.post('/', geminiSdkStructured);

export default completionsRouter;
