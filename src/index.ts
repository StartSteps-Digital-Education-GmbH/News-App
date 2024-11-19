import express from 'express';
import { configs } from './config/env.js';
import { connectDB } from './database/datasource.js';
const app = express();

//Middleware
app.use(express.json());


app.get('/', (req,res) => {
    res.send('Server is working');
})

connectDB().then(() => {
    app.listen(configs.PORT, ()=> {
        console.log(`the Server is running on port ${configs.PORT}`)
    })
})

