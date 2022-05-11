import { Chapter } from 'core/chapters/entities/chapter.entity';
import { Unit } from 'core/units/entities/unit.entity';
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
    console.log('Removing lecture...');
    Chapter.updateMany(
        { $in: { subdivisions: { item: this._id } } },
        { $pull: { subdivisions: { item: this._id } } },
        { multi: true },
    );
    Unit.deleteMany({ chapter: this.chapter });
    next();
});

export const Lecture: Model<ILecture> = model('lectures', LectureSchema);
