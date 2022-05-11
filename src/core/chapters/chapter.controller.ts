import { Request, Response } from 'express';
import errorHandler from '../../utils/errorHandler';
import ChapterService from './chapter.service';

class ChapterController {
    async create(req: Request, res: Response) {
        try {
            const result = await ChapterService.create(req.body);

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await ChapterService.update({
                id: req.params.id,
                data: req.body,
            });

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const result = await ChapterService.getAll();

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const result = await ChapterService.getOne({ id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const result = await ChapterService.remove({ id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }
}

export default new ChapterController();
