import { Course } from 'core/courses/entities/course.entity';
import { User } from 'core/users/entities/user.entity';
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

ClassSchema.pre(/remove|[d,D]elete/, function (next) {
    Course.update(
        { $in: { classes: this._id } },
        { $pull: { classes: this._id } },
        { multi: true },
    );
    User.update(
        { class: this._id },
        { $set: { class: null } },
        { multi: true },
    );
    next();
});

export const Class: Model<IClass> = model('classes', ClassSchema);
