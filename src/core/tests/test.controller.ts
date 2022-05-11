import { Request, Response } from 'express';

import errorHandler from '../../utils/errorHandler';
import TestService from './test.service';

class TestController {
    async create({ body, files }: Request, res: Response) {
        try {
            const result = await TestService.create(
                body,
                files as Express.Multer.File[],
            );

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await TestService.update({
                _id: req.params.id,
                ...req.body,
            });

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async getAll(_req: Request, res: Response) {
        try {
            const result = await TestService.getAll();

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async getOne({ params: { id } }: Request, res: Response) {
        try {
            const result = await TestService.getOne(id);

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async remove({ params: { id } }: Request, res: Response) {
        try {
            const result = await TestService.remove(id);

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async getQuestionsOnly({ params: { id } }: Request, res: Response) {
        try {
            const result = await TestService.getQuestionsOnly(id);

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async checkResults({ body, params }: Request, res: Response) {
        try {
            const result = await TestService.checkResults(params.id, body);

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }
}

export default new TestController();
