import { Request, Response } from 'express';
import { Unit } from './unit.model'
import { Keyword } from '../keywords/keyword.model'
import { Chapter } from '../chapters/chapter.model'
import errorHandler from '../../utils/errorHandler';
import UnitService from './unit.service';

class UnitController {

    async create(req: Request, res: Response) {
        try {
            const result = await UnitService.create(req.body);

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await UnitService.update({ _id: req.params.id, ...req.body });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const result = await UnitService.getAll();

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getByLecture(req: Request, res: Response) {
        try {
            const result = await UnitService.getByLecture({ _id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const result = await UnitService.getOne({ _id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const result = await UnitService.remove({ _id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new UnitController();