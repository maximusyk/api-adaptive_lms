import { model, Model, Schema, Types } from 'mongoose';
import { ITestQuestion } from '../../../types';

const TestQuestionSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: Types.ObjectId,
        ref: 'test_types',
    },
    answers: [
        {
            type: Types.ObjectId,
            ref: 'test_answers',
        },
    ],
    units: [
        {
            ref: 'units',
            type: Types.ObjectId,
        },
    ],
    test: {
        type: Types.ObjectId,
        ref: 'tests',
        required: true,
    },
});

export const TestQuestion: Model<ITestQuestion> = model(
    'test_questions',
    TestQuestionSchema,
);
