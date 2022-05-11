import { model, Model, Schema } from 'mongoose';
import { ITestType } from '../../../types';

const TestTypeSchema: Schema = new Schema({
    title: {
        type: String,
        enum: ['single', 'multiple', 'input'],
        required: true,
    },
});

export const TestType: Model<ITestType> = model('test_types', TestTypeSchema);
