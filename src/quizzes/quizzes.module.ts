import { Module } from "@nestjs/common";
import { QuizzesService } from "./quizzes.service";
import { QuizzesController } from "./quizzes.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Quiz } from "./entities/quiz.entity";
import { QuizAnswer } from "./entities/quiz-answers.entity";
import { QuizQuestion } from "./entities/quiz-questions.entity";
import { QuizQuestionType } from "./entities/quiz-question-types.entity";
import { QuizConfig } from "./entities/quiz-config.entity";
import { QuizResults } from "./entities/quiz-results.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([ Quiz, QuizAnswer, QuizQuestion, QuizQuestionType, QuizConfig, QuizResults ])
  ],
  controllers: [ QuizzesController ],
  providers: [ QuizzesService ]
})
export class QuizzesModule {}
