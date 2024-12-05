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
    app.listen(configs.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`the Server is running on port ${configs.PORT}`);
    });
  });
}

export default app;
