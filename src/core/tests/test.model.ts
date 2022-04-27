import { model, Model, Schema, Types } from 'mongoose';
import { ITest } from '../types';

const TestSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['single', 'multiple', 'input'],
        required: true
    },
    course: {
        ref: 'courses',
        type: Types.ObjectId
    },
    variants: [{
        title: { type: String, required: true },
        isCorrect: { type: Boolean, required: true }
    }],
    units: [
        {
            ref: 'units',
            type: Types.ObjectId
        }
    ]
});

export const Test: Model<ITest> = model('tests', TestSchema);