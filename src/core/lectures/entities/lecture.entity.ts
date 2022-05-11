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
});

LectureSchema.pre('remove', function (next) {
    this.model('chapters').update(
        { $in: { subdivisions: { item: this._id } } },
        { $pull: { subdivisions: { item: this._id } } },
        { multi: true },
    );
    next();
});

export const Lecture: Model<ILecture> = model('lectures', LectureSchema);
