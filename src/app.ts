import bodyParser from 'body-parser';
import express, { Express, NextFunction, Response } from 'express';
import morgan from 'morgan';
import passport from 'passport';

import passMiddleware from './middleware/passport.middleware';
// import authRoutes from './core/users/user.route';
import chapterRoutes from './core/chapters/chapter.route';
import classesRoutes from './core/classes/class.route';
// import coursesRoutes from './routes/course.router';
import usersRoutes from './core/users/user.route';
// import keywordRoutes from './routes/keyword.router';
// import usersRoutes from './routes/user.router';
// import testRoutes from './routes/test.router';

const app: Express = express();

app.use(passport.initialize());
passMiddleware(passport);

app.use((_, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, content-Type, Accept'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/api/auth', usersRoutes.authRouter);
// app.use('/api/courses', coursesRoutes);
app.use('/api/users', usersRoutes.userRouter);
app.use('/api/classes', classesRoutes);
app.use('/api/chapters', chapterRoutes);
// app.use('/api/units', unitRoutes);
// app.use('/api/keywords', keywordRoutes);
// app.use('/api/tests', testRoutes);

// app.use('/api/v2/auth', authRoutes);
// app.use('/api/v2/courses', coursesRoutes);
// app.use('/api/v2/users', usersRoutes);
// app.use('/api/v2/classes', classesRoutes);
// app.use('/api/v2/chapters', chapterRoutes);
// app.use('/api/v2/units', unitRoutes);
// app.use('/api/v2/keywords', keywordRoutes);
// app.use('/api/v2/tests', testRoutes);

export default app;
