import { ApiProperty } from '@nestjs/swagger';
import { QuizConfig } from '../entities/quiz-config.entity';
import { QuizQuestion } from '../entities/quiz-questions.entity';
import { QuizResult } from '../entities/quiz-results.entity';
import { Course } from '../../courses/entities/course.entity';
import { CourseEntityDto } from '../../courses/dto/courses.dto';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { ChapterEntityDto } from '../../chapters/dto/chapters.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Quiz } from '../entities/quiz.entity';
import { UserEntityDto } from '../../users/dto/users.dto';
import { User } from '../../users/entities/user.entity';
import { QuizQuestionType } from '../entities/quiz-question-types.entity';
import { QuizAnswer } from '../entities/quiz-answers.entity';
import { UnitEntityDto } from '../../units/dto/units.dto';
import { Unit } from '../../units/entities/unit.entity';
import { QuizQuestionTypeEnum } from '../enums/quiz-types.enum';
import { IsFile } from '../../is-file.decorator';

export class QuizAnswerEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    isCorrect: boolean;

    @ApiProperty()
    quizQuestionId: string;

    @ApiProperty({ type: () => QuizQuestionEntityDto })
    quizQuestion: QuizQuestion;

    @ApiProperty()
    quizId: string;

    @ApiProperty({ type: () => QuizEntityDto })
    quiz: Quiz;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class QuizConfigEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    attempts: number;

    @ApiProperty()
    duration: Date;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class QuizQuestionTypeEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: QuizQuestionTypeEnum })
    title: QuizQuestionTypeEnum;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class QuizQuestionEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    questionTypeId: string;

    @ApiProperty({ type: () => QuizQuestionTypeEntityDto })
    questionType: QuizQuestionType;

    @ApiProperty({ type: () => [ QuizAnswerEntityDto ] })
    answers: QuizAnswer[];

    @ApiProperty({ type: () => [ UnitEntityDto ] })
    connectedUnits: Unit[];

    @ApiProperty()
    quizId: string;

    @ApiProperty({ type: () => QuizEntityDto })
    quiz: Quiz;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class QuizResultsEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    score: number;

    @ApiProperty()
    quizId: string;

    @ApiProperty({ type: () => QuizEntityDto })
    quiz: Quiz;

    @ApiProperty()
    studentId: string;

    @ApiProperty({ type: () => UserEntityDto })
    student: User;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class QuizEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    quizConfigId: string;

    @ApiProperty({ type: () => QuizConfigEntityDto })
    quizConfig: QuizConfig;

    @ApiProperty({ type: () => QuizQuestionEntityDto })
    quizQuestions: QuizQuestion[];

    @ApiProperty({ type: () => QuizResultsEntityDto })
    quizResults: QuizResult[];

    @ApiProperty({ type: () => CourseEntityDto })
    course: Course;

    @ApiProperty()
    chapterId: string;

    @ApiProperty({ type: () => ChapterEntityDto })
    chapter: Chapter;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class CreateQuizDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    // @IsOptional()
    // @IsUUID(4)
    // @ApiProperty({ required: false })
    // quizConfigId?: string;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    chapterId: string;

    @IsOptional()
    @IsFile({ mime: [ 'application/json' ] })
    @ApiProperty({ required: false })
    quiestionsFile: Express.Multer.File;
}

export class UpdateQuizDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    title?: string;

    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    quizConfigId?: string;

    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    quizQuestionIds?: string;

    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    quizResultIds?: string;
}

export class CreateQuizQuestionDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    questionType: QuizQuestionTypeEnum;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    quizId: string;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty({ isArray: true })
    answers: string[];
}

export class CreateQuizAnswersDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    quizQuestionId: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    isCorrect: boolean;
}