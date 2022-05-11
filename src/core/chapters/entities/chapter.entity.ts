import { Course } from 'core/courses/entities/course.entity';
import { Lecture } from 'core/lectures/entities/lecture.entity';
import { Test } from 'core/tests/entities/tests.entity';
import { model, Model, Schema, Types } from 'mongoose';
import { IChapter } from '../../../types';

const ChapterSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        course: {
            type: Types.ObjectId,
            ref: 'courses',
        },
        subdivisions: [
            {
                item: {
                    type: Types.ObjectId,
                    refPath: 'subdivisionType',
                },
                subdivisionType: {
                    type: String,
                    required: true,
                    enum: ['lectures', 'tests'],
                },
            },
        ],
    },
    { strict: false },
);

ChapterSchema.pre(/remove|[d,D]elete/, function (next) {
    Course.updateMany(
        { $in: { chapters: this._id } },
        { $pull: { chapters: this._id } },
    );
    Lecture.deleteMany({ chapter: this._id });
    Test.deleteMany({ chapter: this._id });
    next();
});

export const Chapter: Model<IChapter> = model('chapters', ChapterSchema);
