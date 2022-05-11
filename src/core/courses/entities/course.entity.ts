import { model, Model, Schema, Types } from 'mongoose';
import { ICourse } from '../../../types';

const CourseSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    instructor: {
        ref: 'users',
        type: Types.ObjectId,
        required: true,
    },
    chapters: [
        {
            type: Types.ObjectId,
            ref: 'chapters',
        },
    ],
    classes: [
        {
            ref: 'classes',
            type: Types.ObjectId,
        },
    ],
    students: [
        {
            ref: 'users',
            type: Types.ObjectId,
        },
    ],
});

CourseSchema.pre(/(?i)(remove)|(delete)/, function (next) {
    next();
});

export const Course: Model<ICourse> = model('courses', CourseSchema);
