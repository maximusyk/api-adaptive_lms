import { model, Model, Schema, Types } from 'mongoose';
import { ILecture } from '../../../types';

const LectureSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    fileId: {
        type: String,
    },
    units: [
        {
            ref: 'units',
            type: Types.ObjectId,
        },
    ],
    viewable: {
        type: Boolean,
        default: false,
    },
    chapter: {
        type: Types.ObjectId,
        ref: 'chapters',
    },
});

LectureSchema.pre(/remove|[d,D]elete/, function (next) {
    this.model('chapters').update(
        { $in: { subdivisions: { item: this._id } } },
        { $pull: { subdivisions: { item: this._id } } },
        { multi: true },
    );
    this.model('units').deleteMany({ chapter: this.chapter });
    next();
});

export const Lecture: Model<ILecture> = model('lectures', LectureSchema);
