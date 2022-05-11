import { Chapter } from 'core/chapters/entities/chapter.entity';
import { model, Model, Schema, Types } from 'mongoose';
import { ITest } from '../../../types';
import { TestAnswer } from './test-answers.entity';
import { TestQuestion } from './test-questions.entity';

const TestSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    course: {
        ref: 'courses',
        type: Types.ObjectId,
    },
    chapter: {
        type: Types.ObjectId,
        ref: 'chapters',
    },
    questions: [
        {
            type: Types.ObjectId,
            ref: 'test_questions',
        },
    ],
});

TestSchema.pre(/remove|[d,D]elete/, function (next) {
    Chapter.update(
        { $in: { subdivisions: { item: this._id } } },
        { $pull: { subdivisions: { item: this._id } } },
        { multi: true },
    );
    TestAnswer.deleteMany({ test: this._id });
    TestQuestion.deleteMany({ test: this._id });
    next();
});

export const Test: Model<ITest> = model('tests', TestSchema);
