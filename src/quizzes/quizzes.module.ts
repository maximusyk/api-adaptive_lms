import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Quiz } from './entities/quiz.entity';
import { QuizAnswer } from './entities/quiz-answers.entity';
import { QuizQuestion } from './entities/quiz-questions.entity';
import { QuizQuestionType } from './entities/quiz-question-types.entity';
import { QuizConfig } from './entities/quiz-config.entity';
import { QuizResult } from './entities/quiz-results.entity';
import { CoursesModule } from '../courses/courses.module';
import { ChaptersModule } from '../chapters/chapters.module';

@Module({
    imports: [
        SequelizeModule.forFeature([ Quiz, QuizAnswer, QuizQuestion, QuizQuestionType, QuizConfig, QuizResult ]),
        CoursesModule,
        ChaptersModule
    ],
    controllers: [ QuizzesController ],
    providers: [ QuizzesService ],
    exports: [ QuizzesService ]
})
export class QuizzesModule {}
