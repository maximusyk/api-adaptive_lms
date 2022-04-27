import { Request, Response } from 'express';
import { Test } from './test.model'
import { Unit } from '../units/unit.model'
import errorHandler from '../../utils/errorHandler';
import { Chapter } from '../chapters/chapter.model';

class TestController {

    async create(req: Request, res: Response) {
        try {
            const candidate = await Test.findOne({ title: req.body.title, course: req.body.course_id }).exec();

            if ( candidate ) {
                return res.status(409).json({
                    message: 'Current test already exists.'
                });
            }

            const test = new Test({ ...req.body });

            await Chapter.findByIdAndUpdate(
                req.body.chapter,
                { $push: { subdivisions: { item: test._id, kind: 'tests' } } },
                { new: true }
            ).exec();

            await test.save();
            return res.status(201).json(test);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const test = await Test.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        ...req.body
                    }
                },
                { new: true }
            ).exec();

            return res.status(200).json(test);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const tests = await Test.find().exec();

            return res.status(200).json(tests);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const test = await Unit.findById(req.params.id).exec();

            return res.status(200).json(test);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const test = await Test.findByIdAndDelete(req.params.id).exec();

            if ( !test ) {
                return res.status(404).json({ msg: 'This test no longer exist' });
            }

            return res.status(200).json({ success: true });
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new TestController();