import express from 'express';
import { configs } from './config/env.js';
const app = express();

//Middleware
app.use(express.json());


app.get('/', (req,res) => {
    res.send('Server is working');
})

app.listen(configs.PORT, ()=> {
    console.log(`the Server is running on port ${configs.PORT}`)
})

