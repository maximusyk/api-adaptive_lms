import { Request, Response } from 'express';
import errorHandler from '../../utils/errorHandler';
import ClassService from './class.service';

class ClassController {
    async create(req: Request, res: Response) {
        try {
            const result = await ClassService.create(req.body);

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await ClassService.update({ id: req.params.id, data: req.body });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const result = await ClassService.getAll();

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne({ params: { id } }: Request, res: Response) {
        try {
            const result = await ClassService.getOne({ id });
            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove({ params: { id } }: Request, res: Response) {
        try {
            const result = await ClassService.remove({ id });
            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new ClassController();