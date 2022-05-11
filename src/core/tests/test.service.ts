import { ITestAnswer, ITestQuestion } from '../../types';
import { Chapter } from '../chapters/entities/chapter.entity';
import { Test } from './entities/tests.entity';

interface ITestServiceArgs {
    _id?: string;
    title?: string;
    course?: string;
    chapter?: string;
    questions?: ITestQuestion[];
}

class TestService {
    async create(testData: ITestServiceArgs, questions: Express.Multer.File[]) {
        const candidate = await Test.findOne({
            $and: [{ title: testData.title }, { course: testData.course }],
        }).exec();

        if (candidate) {
            return {
                status: 409,
                body: { message: 'Current test already exists.' },
            };
        }

        const questionsCandidate = questions.length
            ? (JSON.parse(questions[0].buffer.toString()) as ITestQuestion[])
            : [];

        if (
            questionsCandidate &&
            questionsCandidate.length &&
            !this.validateTestQuestions(questionsCandidate)
        ) {
            return {
                status: 409,
                body: {
                    message:
                        'Questions is not valid, please make sure you write it correctly.',
                },
            };
        }

        const test = await Test.create({
            ...testData,
            questions: questionsCandidate,
        });

        await Chapter.findByIdAndUpdate(
            testData.chapter,
            {
                $push: {
                    subdivisions: { item: test._id, subdivisionType: 'tests' },
                },
            },
            { new: true },
        ).exec();

        await test.save();
        return { status: 201, body: test };
    }

    async update(data: ITestServiceArgs) {
        const test = await Test.findById(data._id).exec();

        if (!test) {
            return {
                status: 404,
                body: { message: 'Test not found' },
            };
        }

        if (
            data.questions &&
            data.questions.length &&
            !this.validateTestQuestions(data.questions)
        ) {
            return {
                status: 409,
                body: {
                    message:
                        'Questions is not valid, please make sure you write it correctly.',
                },
            };
        }

        const updatedTest = await test
            .update({ ...data }, { new: true })
            .exec();

        return { status: 200, body: updatedTest };
    }

    async getAll() {
        const tests = await Test.find().exec();

        return { status: 200, body: tests };
    }

    async getOne(id: string) {
        const test = await Test.findById(id).exec();

        if (!test) {
            return {
                status: 404,
                body: { message: 'Test not found' },
            };
        }

        return { status: 200, body: test };
    }

    async remove(id: string) {
        const candidate = await Test.findById(id).exec();
        if (!candidate) {
            return {
                status: 404,
                body: { message: 'Provided test doesn`t exists' },
            };
        }

        await candidate.remove();

        return { status: 200, body: { success: true } };
    }

    async getQuestionsOnly(id: string) {
        const test = await Test.findById(id).exec();

        if (!test) {
            return {
                status: 404,
                body: { message: 'Test not found' },
            };
        }

        const questions = test.questions.map(({ title, type, answers }) => ({
            title,
            type,
            answers: answers.map(({ title }) => title),
        }));

        return { status: 200, body: questions };
    }

    async checkResults(id: string, answers: ITestAnswer[]) {
        const test = await Test.findById(id).exec();

        if (!test) {
            return {
                status: 404,
                body: { message: 'Test not found' },
            };
        }

        const correctAnswers = test.questions
            .map(
                ({ answers }) =>
                    answers.filter(({ isCorrect }) => isCorrect).at(0)?.title ||
                    '',
            )
            .filter(Boolean);

        const studentCorrectAnswers = answers.filter(({ title }) =>
            correctAnswers.includes(title),
        );

        const resultRate =
            (studentCorrectAnswers.length / correctAnswers.length) * 100;

        return { status: 200, body: { resultRate } };
    }

    validateTestQuestions(questions: ITestQuestion[]) {
        questions.forEach((question) => {
            if (!question.title.length) return false;
            if (question.answers.some(({ title }) => title.length < 6))
                return false;
            switch (question.type.title) {
                case 'single':
                    if (
                        question.answers.filter(({ isCorrect }) => isCorrect)
                            .length !== 1
                    )
                        return false;
                    break;
                case 'multiple':
                    if (
                        question.answers.filter(({ isCorrect }) => isCorrect)
                            .length < 2 ||
                        question.answers.length ===
                            question.answers.filter(
                                ({ isCorrect }) => !isCorrect,
                            ).length
                    )
                        return false;
                    break;
                case 'input':
                    if (
                        question.answers.length > 1 ||
                        question.answers.filter(({ isCorrect }) => isCorrect)
                            .length !== 1
                    )
                        return false;
                    break;
            }
        });

        return true;
    }
}

export default new TestService();
