import { model, Model, Schema, Types } from 'mongoose';
import { ICourse } from '../../types';

const CourseSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    chapters: [
        {
            type: Types.ObjectId,
            ref: 'chapters',
            required: true,
        },
    ],
    instructor: {
        ref: 'users',
        type: Types.ObjectId,
    },
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

export const Course: Model<ICourse> = model('courses', CourseSchema);