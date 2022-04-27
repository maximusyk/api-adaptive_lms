import { model, Model, Schema, Types } from 'mongoose';
import { IUnit } from '../../types';

const UnitSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    keywords: [
        {
            ref: 'keywords',
            type: Types.ObjectId
        }
    ],
    content: {
        type: String,
        required: true
    },
    course: {
        type: Types.ObjectId,
        ref: 'courses'
    },
    chapter: {
        type: Types.ObjectId,
        ref: 'chapters'
    },
    connectivity: [{
        unit_id: {
            type: Types.ObjectId,
            ref: 'units'
        },
        percentage: { type: Number }
    }]
});

export const Unit: Model<IUnit> = model('units', UnitSchema);