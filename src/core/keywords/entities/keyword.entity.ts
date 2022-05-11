import { Unit } from 'core/units/entities/unit.entity';
import { model, Model, Schema } from 'mongoose';
import { IKeyword } from '../../../types';

const KeywordSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
});

KeywordSchema.pre(/remove|[d,D]elete/, function (next) {
    Unit.update(
        { $in: { keywords: { item: this._id } } },
        { $pull: { keywords: { item: this._id } } },
        { multi: true },
    );
    next();
});

export const Keyword: Model<IKeyword> = model('keywords', KeywordSchema);
