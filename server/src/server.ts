import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import { router } from './routes';
import errorHandler from './errors/handler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(3333, () => console.log("Server is running"));