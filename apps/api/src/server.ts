import express, { Express } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';

const app: Express = express()

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use('/api/v1', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
}));
app.use(compression({
    threshold: 1024,
    level: 6,
    filter: (req, res) => {
        if (req.headers['x-no-compression'] || req.query.nozip) {
            return false;
        } return compression.filter(req, res);
    }
}))

export default app;