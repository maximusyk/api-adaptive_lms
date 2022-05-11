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

export const Chapter: Model<IChapter> = model('chapters', ChapterSchema);
