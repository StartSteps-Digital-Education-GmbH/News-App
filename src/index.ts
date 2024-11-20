import express from 'express';
import { configs } from './config/env.js';
import { connectDB } from './config/database.js';
import router from './routes.js';
const app = express();

//Middleware
app.use(express.json());

app.use(router);

connectDB().then(() => {
    app.listen(configs.PORT, ()=> {
        console.log(`the Server is running on port ${configs.PORT}`)
    })
})