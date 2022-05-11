import { Lecture } from 'core/lectures/entities/lecture.entity';
import { TestQuestion } from 'core/tests/entities/test-questions.entity';
import { model, Model, Schema, Types } from 'mongoose';
import { IUnit } from '../../../types';

const UnitSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    chapter: {
        type: Types.ObjectId,
        ref: 'chapters',
    },
    course: {
        type: Types.ObjectId,
        ref: 'courses',
    },
    content: {
        type: String,
        required: true,
    },
    keywords: [
        {
            ref: 'keywords',
            type: Types.ObjectId,
        },
    ],
    connectivity: [
        {
            unit: {
                type: Types.ObjectId,
                ref: 'units',
            },
            rate: { type: Number },
        },
    ],
});

UnitSchema.pre(/remove|[d,D]elete/, function (next) {
    this.model('units', UnitSchema).update(
        { $in: { connectivity: { unit: this._id } } },
        { $pull: { connectivity: { unit: this._id } } },
        { multi: true },
    );
    Lecture.updateMany(
        { $in: { units: this._id } },
        { $pull: { units: this._id } },
        { multi: true },
    );
    TestQuestion.updateMany(
        { $in: { units: this._id } },
        { $pull: { units: this._id } },
        { multi: true },
    );
    next();
});

export const Unit: Model<IUnit> = model('units', UnitSchema);
