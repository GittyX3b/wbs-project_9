import { Router } from 'express';
 
const analysisRoutes = Router();

analysisRoutes.get('/', (req, res) => {
    console.log(req.body)
    res.json({
    message: 'Get req created successfully',
  });
});
 
export default analysisRoutes;