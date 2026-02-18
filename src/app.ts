import express, {Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app: Application = express();

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

//simple route to test
app.get('/', (req: Request, res:Response)=>{
    res.send('Decision Engine is Active');
});

export default app;