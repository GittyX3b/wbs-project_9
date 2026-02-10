import { Router } from 'express';
import { validateZod } from '#middlewares';
import { zoneInputSchema } from '#schemas';
import { getBaseLayers, getPoisByZone } from '#controllers';

const geoRoutes = Router();

geoRoutes.post('/data', validateZod(zoneInputSchema), getBaseLayers);
geoRoutes.get('/pois', getPoisByZone);

export default geoRoutes;
