import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuizAnswersDto, CreateQuizDto, CreateQuizQuestionDto, UpdateQuizDto } from './dto/quizzes.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Quiz } from './entities/quiz.entity';
import { ChaptersService } from '../chapters/chapters.service';
import { CoursesService } from '../courses/courses.service';
import { QuizQuestion } from './entities/quiz-questions.entity';
import { QuizQuestionType } from './entities/quiz-question-types.entity';
import { QuizAnswer } from './entities/quiz-answers.entity';
import { QuizConfig } from './entities/quiz-config.entity';
import { QuizResult } from './entities/quiz-results.entity';
import { v4 as uuidv4 } from 'uuid';
import { QuizQuestionTypeEnum } from './enums/quiz-types.enum';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectModel(Quiz) private readonly quizRepository: typeof Quiz,
        @InjectModel(QuizQuestion) private readonly quizQuestionRepository: typeof QuizQuestion,
        @InjectModel(QuizQuestionType) private readonly quizQuestionTypeRepository: typeof QuizQuestionType,
        @InjectModel(QuizAnswer) private readonly quizAnswerRepository: typeof QuizAnswer,
        @InjectModel(QuizConfig) private readonly quizConfigRepository: typeof QuizConfig,
        @InjectModel(QuizResult) private readonly quizResultRepository: typeof QuizResult,
        private readonly chaptersService: ChaptersService,
        private readonly coursesService: CoursesService
    ) {}

    async create(createQuizDto: CreateQuizDto) {
        try {
            await this.chaptersService.findById(createQuizDto.chapterId);
            if ( !createQuizDto.quiestionsFile ) {
                return this.quizRepository.create(createQuizDto, { include: { all: true } });
            }

            const quizId = uuidv4();
            const rawQuestionArray = JSON.parse(createQuizDto.quiestionsFile.buffer.toString());

            await this.createQuestions(rawQuestionArray, quizId);

            return this.quizRepository.create({ ...createQuizDto, id: quizId }, { include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findAll() {
        try {
            return this.quizRepository.findAll({ include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async createQuestions(questions: CreateQuizQuestionDto[], quizId: string) {
        try {
            if ( !quizId ) {
                throw new HttpException('quizId is required!', HttpStatus.BAD_REQUEST);
            }

            if ( !this.validateQuizQuestions(questions) ) {
                throw new HttpException('Invalid quiz questions!', HttpStatus.BAD_REQUEST);
            }

            const questionTypes = await this.quizQuestionTypeRepository.findAll();

            const preparedQuestions = [];
            for await ( const question of questions ) {
                const questionId = uuidv4();
                const questionType = questionTypes.find((type) => type.title === question.questionType);
                // @ts-ignore
                await this.createAnswers(question.answers, questionId);

                preparedQuestions.push({
                    id: questionId,
                    quizId,
                    questionTypeId: questionType.id,
                    title: question.title
                });
            }

            return this.quizQuestionRepository.bulkCreate(preparedQuestions);
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async createAnswers(answers: CreateQuizAnswersDto[], questionId: string): Promise<string[]> {
        try {
            if ( !questionId ) {
                throw new HttpException('questionId is required!', HttpStatus.BAD_REQUEST);
            }

            const preparedAnswers = answers.map((answer) => ({ ...answer, questionId }));

            const quizAnswers = await this.quizAnswerRepository.bulkCreate(preparedAnswers);

            return quizAnswers.map((answer) => answer.id);
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string) {
        try {
            return this.quizRepository.findByPk(id, { include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateQuizDto: UpdateQuizDto) {
        try {
            // if ( updateQuizDto.professorId ) {
            //   await this.usersService.checkRole(updateQuizDto.professorId, RoleEnum.PROFESSOR);
            // }
            return this.quizRepository.update(updateQuizDto, { where: { id } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string) {
        try {
            if ( !id ) {
                throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);
            }
            const chapter = await this.quizRepository.scope('withDeletedAt').findOne({ where: { id } });
            if ( !chapter ) {
                throw new HttpException('Chapter not found!', HttpStatus.NOT_FOUND);
            }

            await chapter.destroy();

            return { statusCode: HttpStatus.OK, message: 'Success!' };
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    validateQuizQuestions(questions: CreateQuizQuestionDto[]): boolean {
        try {
            for ( const question of questions ) {
                if ( !question.title ) {
                    throw new HttpException('Question title is required!', HttpStatus.BAD_REQUEST);
                }

                if ( !question.questionType ) {
                    throw new HttpException('Question type is required!', HttpStatus.BAD_REQUEST);
                }

                if ( !question.answers ) {
                    throw new HttpException('Question answers are required!', HttpStatus.BAD_REQUEST);
                }

                if ( !question.answers.length ) {
                    throw new HttpException('Question answers are required!', HttpStatus.BAD_REQUEST);
                }

                if ( question.answers.length < 2 ) {
                    throw new HttpException('Question answers must be at least 2!', HttpStatus.BAD_REQUEST);
                }

                if ( question.answers.length > 4 ) {
                    throw new HttpException('Question answers must be less than 4!', HttpStatus.BAD_REQUEST);
                }

                for ( const answer of question.answers ) {
                    // @ts-ignore
                    if ( !answer.title ) {
                        throw new HttpException('Answer title is required!', HttpStatus.BAD_REQUEST);
                    }

                    // @ts-ignore
                    if ( !answer.isCorrect ) {
                        throw new HttpException('Answer isCorrect is required!', HttpStatus.BAD_REQUEST);
                    }
                }

                if ( question.questionType === QuizQuestionTypeEnum.SINGLE_CHOICE ) {
                    // @ts-ignore
                    if ( question.answers.filter(answer => answer.isCorrect).length !== 1 ) {
                        throw new HttpException(
                            'Single choice question must have only one correct answer!',
                            HttpStatus.BAD_REQUEST
                        );
                    }
                } else if ( question.questionType === QuizQuestionTypeEnum.MULTIPLE_CHOICE ) {
                    // @ts-ignore
                    if ( question.answers.filter(answer => answer.isCorrect).length < 2 ) {
                        throw new HttpException(
                            'Multiple choice question must have at least two correct answers!',
                            HttpStatus.BAD_REQUEST
                        );
                    }
                } else if ( question.questionType === QuizQuestionTypeEnum.TEXT_INPUT ) {
                    // @ts-ignore
                    if ( !question.answers.length ) {
                        throw new HttpException(
                            'Text input question must have at least one answer!',
                            HttpStatus.BAD_REQUEST
                        );
                    }
                } else {
                    throw new HttpException('Question type is not valid!', HttpStatus.BAD_REQUEST);
                }
            }

            return true;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }
}
