import express, { Express } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

const app: Express = express()

app.use(cors({
    origin: process.env.TRUSTED_ORIGINS?.split(',').map(origin => origin.trim()) || [],
    credentials: true,
}));
app.all("/api/v1/auth/*splat", toNodeHandler(auth)); // Better Auth middleware
app.use(helmet());
app.use(compression());
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
app.use(express.json());


export default app;