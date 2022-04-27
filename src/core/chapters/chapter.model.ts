import { model, Model, Schema, Types } from 'mongoose';
import { IChapter } from '../../types';

const ChapterSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    subdivisions: [{
        item: {
            type: Types.ObjectId,
            refPath: 'subdivisionType'
        },
        kind: String
    }]
});

export const Chapter: Model<IChapter> = model('chapters', ChapterSchema);