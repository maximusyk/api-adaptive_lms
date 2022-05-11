import { model, Model, Schema } from 'mongoose';
import { ITestAnswer } from '../../../types';

const TestAnswerSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'tests',
        required: true,
    },
});

export const TestAnswer: Model<ITestAnswer> = model(
    'test_answers',
    TestAnswerSchema,
);
