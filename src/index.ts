import express from 'express';

import { configs } from './config/env.js';
import { connectDB } from './config/database.js';
import router from './routes.js';

const app = express();

//Middleware
app.use(express.json());

app.use('/api', router);

if (configs.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const port = Number(configs.PORT) || 5000; // Default to 5000 if PORT is invalid
    app.listen(port, '0.0.0.0', () => {
      console.log(`The Server is running on port ${port}`);
    });
  });
}

export default app;
