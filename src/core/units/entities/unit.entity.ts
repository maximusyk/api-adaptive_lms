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

UnitSchema.pre(/(?i)(remove)|(delete)/, function (next) {
    this.model('units').update(
        { $in: { connectivity: { unit: this._id } } },
        { $pull: { connectivity: { unit: this._id } } },
        { multi: true },
    );
    this.model('lectures').update(
        { $in: { units: this._id } },
        { $pull: { units: this._id } },
        { multi: true },
    );
    this.model('test_questions').update(
        { $in: { units: this._id } },
        { $pull: { units: this._id } },
        { multi: true },
    );
    next();
});

export const Unit: Model<IUnit> = model('units', UnitSchema);
