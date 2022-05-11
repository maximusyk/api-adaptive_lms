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

ChapterSchema.pre(/(?i)(remove)|(delete)/, function (next) {
    this.model('courses').update(
        { $in: { chapters: this._id } },
        { $pull: { chapters: this._id } },
    );
    this.model('lectures').deleteMany({ chapter: this._id });
    this.model('tests').deleteMany({ chapter: this._id });
    next();
});

export const Chapter: Model<IChapter> = model('chapters', ChapterSchema);
