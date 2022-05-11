import { model, Model, Schema, Types } from 'mongoose';
import { IClass } from '../../../types';

const ClassSchema: Schema = new Schema({
    title: {
        type: String,
        unique: true,
    },
    students: [
        {
            ref: 'users',
            type: Types.ObjectId,
        },
    ],
    courses: [
        {
            ref: 'courses',
            type: Types.ObjectId,
        },
    ],
});

ClassSchema.pre(/(?i)(remove)|(delete)/, function (next) {
    next();
});

export const Class: Model<IClass> = model('classes', ClassSchema);
