import cors from 'cors';
import express from 'express';
import '#db';
import { CLIENT_BASE_URL } from '#config';
import { errorHandler, notFoundHandler } from '#middlewares';
import { geoRoutes, featuresRoutes, questionRoutes } from '#routes';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: CLIENT_BASE_URL }));
app.use(express.json());

app.get('/', (req, res) => res.send('Map-Told API is running!'));

app.use('/features', featuresRoutes);
app.use('/geo', geoRoutes);

app.use('/*splat', notFoundHandler);

app.use('/question', questionRoutes)



app.get('/', (req, res) => res.send('RestAPI is running'));

app.use('/*splat', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
