import { Request, Response } from 'express';
import { Unit } from './unit.model';
import { Keyword } from '../keywords/keyword.model';
import { Chapter } from '../chapters/chapter.model';
import { IKeyword } from '../../types';

interface IUnitServiceArgs {
    _id: string;
    title: string;
    chapter: string;
    content: string;
    keywords: IKeyword[];
}

class UnitService {
    async create(data: IUnitServiceArgs) {
        const candidate = await Unit.findOne({ title: data.title }).exec();

        if ( candidate ) {
            return { status: 409, body: { message: 'Current unit already exists.' } };
        }

        const existedKeywords = await Keyword.find({
            title: {
                $in: data.keywords
            }
        }).exec();

        const newKeywords = await Keyword.insertMany(
            data.keywords
                .filter(
                    (item: any) =>
                        !existedKeywords.map(({ title }) => title).includes(item)
                )
                .map((item: any) => ({ title: item }))
        );

        const unit = new Unit({
            title: data.title,
            chapter: data.chapter,
            content: data.content,
            keywords: newKeywords
            .map((item) => item._id)
            .concat(existedKeywords.map((item) => item._id))
        });

        await Chapter.findByIdAndUpdate(
            data.chapter,
            {
                $push: { units: unit._id }
            },
            { new: true }
        ).exec();

        await unit.save();
        return { status: 201, body: unit };
    }

    async update(data: IUnitServiceArgs) {
        const reqBody = (({ _id, chapter, ...obj }) => obj)(data); // Copy object exclude _id and chapter
        const existedKeywords = await Keyword.find({
            title: {
                $in: reqBody.keywords
            }
        }).exec();

        const newKeywords = await Keyword.insertMany(
            reqBody.keywords
                   .filter(
                       (item: any) =>
                           !existedKeywords.map(({ title }) => title).includes(item)
                   )
                   .map((item: any) => ({ title: item }))
        );

        const unit = await Unit.findByIdAndUpdate(
            data._id,
            {
                $set: {
                    ...reqBody, keywords: newKeywords
                    .map((item) => item._id)
                    .concat(existedKeywords.map((item) => item._id))
                }
            },
            { new: true }
        ).populate('keywords').exec();

        return { status: 200, body: unit };
    }

    async getAll() {
        const units = await Unit.find().exec();

        return { status: 200, body: units };
    }

    async getByLecture({ _id }: Partial<IUnitServiceArgs>) {
        const units = await Unit.find({ lecture: _id }).exec();

        return { status: 200, body: units };
    }

    async getOne({ _id }: Partial<IUnitServiceArgs>) {
        const unit = await Unit.findById(_id).exec();

        return { status: 200, body: unit };
    }

    async remove({ _id }: Partial<IUnitServiceArgs>) {
        const unit = await Unit.findByIdAndDelete(_id).exec();

        if ( !unit ) {
            return { status: 404, body: { message: 'This unit no longer exist' } };
        }

        await Chapter.findOneAndUpdate(
            { units: unit._id },
            {
                $pullAll: { units: [unit._id] }
            }
        ).exec();

        return { status: 200, body: { success: true } };
    }
}

export default new UnitService();