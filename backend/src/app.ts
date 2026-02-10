import cors from 'cors';
import express from 'express';
import '#db';
import { CLIENT_BASE_URL } from '#config';
import { errorHandler, notFoundHandler } from '#middlewares';
import { geoRoutes, questionRoutes, completionsRouter } from '#routes';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: CLIENT_BASE_URL }));
app.use(express.json());

app.get('/', (req, res) => res.send('Map-Told API is running!'));

app.use('/geo', geoRoutes);
app.use('/question', questionRoutes);

app.use('/ai', completionsRouter);

app.use('/*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
