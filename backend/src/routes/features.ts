import { Router } from 'express';
 
const featuresRoutes = Router();

featuresRoutes.post('/', (req, res) => {
  console.log(req.body)
    res.json({
    message: 'Post req created successfully',
  });
});
 
export default featuresRoutes;