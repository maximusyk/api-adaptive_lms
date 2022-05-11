import { model, Model, Schema, Types } from 'mongoose';
import { ITest } from '../../../types';

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

TestSchema.pre(/(?i)(remove)|(delete)/, function (next) {
    this.model('chapters').update(
        { $in: { subdivisions: { item: this._id } } },
        { $pull: { subdivisions: { item: this._id } } },
        { multi: true },
    );
    this.model('test_answers').deleteMany({ test: this._id });
    this.model('test_questions').deleteMany({ test: this._id });
    next();
});

export const Test: Model<ITest> = model('tests', TestSchema);
