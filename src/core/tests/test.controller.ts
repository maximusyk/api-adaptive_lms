import { Request, Response } from 'express';
import errorHandler from '../../utils/errorHandler';
import TestService from './test.service';

class TestController {
    async create(req: Request, res: Response) {
        try {
            const result = await TestService.create(req.body);

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await TestService.update({ _id: req.params.id, ...req.body });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const result = await TestService.getAll();

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const result = await TestService.getOne({ _id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const result = await TestService.remove({ _id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new TestController();