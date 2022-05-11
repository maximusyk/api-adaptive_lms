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
    this.model('chapters').deleteMany({ course: this._id });
    this.model('class').update(
        { course: this._id },
        { $pull: { courses: this._id } },
        { multi: true },
    );
    this.model('users').update(
        { $in: { progress: { course: this._id } } },
        { $pull: { progress: { course: this._id } } },
        { multi: true },
    );
    next();
});

export const Course: Model<ICourse> = model('courses', CourseSchema);
