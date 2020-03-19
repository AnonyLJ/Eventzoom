import express from 'express';
import http from 'http';
import cors from 'cors';
import Mongoose from 'mongoose';
import winston from 'winston';
import clientConfig from '../config/client';
import hello from './controllers/hello';
import events from './controllers/event.controller';
import users from './controllers/users.controller';
import series from './controllers/series.controller';
import './helpers/connectToDatabase';
import './helpers/winston';
import passport from './services/passport.service';
import statisticsService from './services/statistics.service';
import email from './controllers/email.controller';


winston.info(`Client project URL is ${clientConfig.url}`);

const app = express();
const server = http.createServer(app);

passport.initPassport(app);
app.use(cors({ origin: clientConfig.url }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // TODO: probably don't need this
app.use('/hello', hello);
app.use('/events', events);
app.use('/users', users);
app.use('/series', series);
app.use('/emails', email);

app.get('/statistics', async (req, res) => {
	res.send(await statisticsService.getStatistics());
});


app.get('/', (req, res) => {
	winston.info('hitting sample endpoint');
	res.send('sample endpoint has been hit');
});
export default { app, server, db: Mongoose.connection };
