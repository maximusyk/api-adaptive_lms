import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { UnitsModule } from "./units/units.module";
import { TokensModule } from "./tokens/tokens.module";
import { QuizzesModule } from "./quizzes/quizzes.module";
import { LecturesModule } from "./lectures/lectures.module";
import { ChaptersModule } from "./chapters/chapters.module";
import { GroupsModule } from "./groups/groups.module";
import { CoursesModule } from "./courses/courses.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RolesModule } from "./roles/roles.module";
import { User } from "./users/entities/user.entity";
import { Role } from "./roles/entities/role.entity";
import { Chapter } from "./chapters/entities/chapter.entity";
import { Course } from "./courses/entities/course.entity";
import { Group } from "./groups/entities/group.entity";
import { Lecture } from "./lectures/entities/lecture.entity";
import { Quiz } from "./quizzes/entities/quiz.entity";
import { QuizAnswer } from "./quizzes/entities/quiz-answers.entity";
import { QuizQuestion } from "./quizzes/entities/quiz-questions.entity";
import { QuizQuestionType } from "./quizzes/entities/quiz-question-types.entity";
import { QuizConfig } from "./quizzes/entities/quiz-config.entity";
import { QuizResults } from "./quizzes/entities/quiz-results.entity";
import { Token } from "./tokens/entities/token.entity";
import { Unit } from "./units/entities/unit.entity";
import { UserRoles } from "./roles/entities/user-roles.entity";
import { CohesionRate } from "./units/entities/cohesion-rate.entity";
import { GroupCourse } from "./groups/entities/group-courses.entity";

// TODO: Add nestjs-i18n support

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.${ process.env.NODE_ENV }.env` }),
    SequelizeModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => ({
        dialect: config.get("DATABASE_DIALECT"),
        host: config.get("DATABASE_HOST"),
        port: config.get("DATABASE_PORT"),
        username: config.get("DATABASE_USER"),
        password: config.get("DATABASE_PASSWORD"),
        database: config.get("DATABASE_NAME"),
        models: [
          Chapter,
          Course,
          Group,
          GroupCourse,
          Lecture,
          Quiz,
          QuizAnswer,
          QuizQuestion,
          QuizQuestionType,
          QuizConfig,
          QuizResults,
          Role,
          UserRoles,
          Token,
          CohesionRate,
          Unit,
          User
        ]
      })
    }),
    UsersModule,
    RolesModule,
    CoursesModule,
    GroupsModule,
    ChaptersModule,
    // KeywordsModule,
    // LectureReferencesModule,
    LecturesModule,
    QuizzesModule,
    TokensModule,
    UnitsModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}