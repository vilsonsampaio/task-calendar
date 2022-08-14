import express from 'express';
import cors from 'cors';

import { router } from './routes';

const app = express();

app.use(cors({ 
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.APP_FRONT_URL  
}));
app.use(express.json());
app.use(router);

app.listen(3000, () => console.log("Server is running"));