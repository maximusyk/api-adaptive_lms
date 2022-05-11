import { Request, Response } from 'express';
import KeywordService from './keyword.service';
import errorHandler from '../../utils/errorHandler';

class KeywordController {
    async create(req: Request, res: Response) {
        try {

            const result = await KeywordService.create(req.body);

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await KeywordService.update({ id: req.params.id, keywordData: req.body });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const result = await KeywordService.getAll();

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const result = await KeywordService.getOne({ id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const result = await KeywordService.remove({ id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new KeywordController();