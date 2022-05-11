import bodyParser from 'body-parser';
import express, { Express, NextFunction, Response } from 'express';
import morgan from 'morgan';
import multer from 'multer';
import passport from 'passport';

import chapterRoutes from './core/chapters/chapter.route';
import classesRoutes from './core/classes/class.route';
import coursesRoutes from './core/courses/course.route';
import unitRoutes from './core/keywords/keyword.route';
import lectureRoutes from './core/lectures/lecture.route';
import testRoutes from './core/tests/test.route';
import keywordRoutes from './core/units/unit.route';
import usersRoutes from './core/users/user.route';
import passMiddleware from './middleware/passport.middleware';

const uploadMulter = multer();

const app: Express = express();

app.use(uploadMulter.any());
app.use(passport.initialize());
passMiddleware(passport);

app.use((_, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, content-Type, Accept',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', usersRoutes.authRouter);
app.use('/api/courses', coursesRoutes);
app.use('/api/users', usersRoutes.userRouter);
app.use('/api/classes', classesRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/keywords', keywordRoutes);
app.use('/api/tests', testRoutes);

export default app;
