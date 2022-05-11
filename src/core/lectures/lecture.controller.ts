import { Request, Response } from 'express';
import { Readable } from 'stream';

import errorHandler from '../../utils/errorHandler';
import LectureService from './lecture.service';

class LectureController {
    async create({ body, files }: Request, res: Response) {
        try {
            const result = await LectureService.create({
                ...body,
                content: files as Express.Multer.File[],
            });

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async update({ body, params }: Request, res: Response) {
        try {
            const result = await LectureService.update({
                ...body,
                id: params.id,
            });

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async editLecture({ params: { id }, files }: Request, res: Response) {
        try {
            const result = await LectureService.editLecture({
                id,
                content: files as Express.Multer.File[],
            });

            if (result instanceof Readable) {
                return result.pipe(res);
            }

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async getOne({ params: { id } }: Request, res: Response) {
        try {
            const result = await LectureService.getOne({ id });

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async readLecture({ params: { id } }: Request, res: Response) {
        try {
            const result = await LectureService.readLecture(id);

            return result.pipe(res);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async getAll(_req: Request, res: Response) {
        try {
            const result = await LectureService.getAll();

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }

    async remove({ params: { id } }: Request, res: Response) {
        try {
            const result = await LectureService.remove(id);

            return res.status(result.status).json(result.body);
        } catch (error) {
            errorHandler(res, error);
        }
    }
}

export default new LectureController();
