import { Request, Response } from 'express';
import { Unit } from './unit.model'
import { Keyword } from '../keywords/keyword.model'
import { Chapter } from '../chapters/chapter.model'
import errorHandler from '../../utils/errorHandler';

class UnitController {

    async create(req: Request, res: Response) {
        try {
            const candidate = await Unit.findOne({ title: req.body.title }).exec();

            if ( candidate ) {
                return res.status(409).json({
                    message: 'Current unit already exists.'
                });
            }

            const existedKeywords = await Keyword.find({
                title: {
                    $in: req.body.keywords
                }
            }).exec();

            const newKeywords = await Keyword.insertMany(
                req.body.keywords
                   .filter(
                       (item: any) =>
                           !existedKeywords.map(({ title }) => title).includes(item)
                   )
                   .map((item: any) => ({ title: item }))
            );

            const unit = new Unit({
                title: req.body.title,
                chapter: req.body.chapter,
                content: req.body.content,
                keywords: newKeywords
                .map((item) => item._id)
                .concat(existedKeywords.map((item) => item._id))
            });

            await Chapter.findByIdAndUpdate(
                req.body.chapter,
                {
                    $push: { units: unit._id }
                },
                { new: true }
            ).exec();

            await unit.save();
            return res.status(201).json(unit);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const reqBody = (({ _id, chapter, ...obj }) => obj)(req.body); // Copy object exclude _id and chapter
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
                req.params.id,
                {
                    $set: {
                        ...reqBody, keywords: newKeywords
                        .map((item) => item._id)
                        .concat(existedKeywords.map((item) => item._id))
                    }
                },
                { new: true }
            ).populate('keywords').exec();

            return res.status(200).json(unit);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const units = await Unit.find().exec();

            return res.status(200).json(units);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const units = await Unit.find({ chapter: req.params.id }).exec();

            return res.status(200).json(units);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const unit = await Unit.findByIdAndDelete(req.params.id).exec();

            if ( !unit ) {
                return res.status(404).json({ msg: 'This unit no longer exist' });
            }

            await Chapter.findOneAndUpdate(
                { units: unit._id },
                {
                    $pullAll: { units: [unit._id] }
                }
            ).exec();

            return res.status(200).json({ success: true });
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new UnitController();