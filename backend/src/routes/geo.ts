import { Router } from 'express';
import { validateZod } from '#middlewares';
import { zoneInputSchema } from '#schemas';
import { getGeoData } from '#controllers';

const geoRoutes = Router();

geoRoutes.post('/data', validateZod(zoneInputSchema), getGeoData);

export default geoRoutes;
