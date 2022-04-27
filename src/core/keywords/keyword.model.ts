import { model, Model, Schema, Types } from 'mongoose';
import { IKeyword } from '../../types';

const KeywordSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
});

export const Keyword: Model<IKeyword> = model('keywords', KeywordSchema);