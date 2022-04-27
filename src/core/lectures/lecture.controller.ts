import { Request, Response } from 'express';
import errorHandler from '../../utils/errorHandler';
import LectureService from './lecture.service';

class LectureController {
    async create(req: Request, res: Response) {
        try {
            const result = await LectureService.create({ ...req.body, content: req.file });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            //@ts-ignore
            const result = await LectureService.update({ ...req.body, id: req.params.id, file: req.file.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const result = await LectureService.getAll();

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne({ params: { id } }: Request, res: Response) {
        try {
            const result = await LectureService.getOne({ id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove({ params: { id } }: Request, res: Response) {
        try {
            const result = await LectureService.remove({ id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new LectureController();