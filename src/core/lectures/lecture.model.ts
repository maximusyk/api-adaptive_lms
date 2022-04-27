import { model, Model, Schema, Types } from 'mongoose';
import { ILecture } from '../../types';

const LectureSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    units: [
        {
            ref: 'units',
            type: Types.ObjectId
        }
    ]
});

export const Lecture: Model<ILecture> = model('lectures', LectureSchema);