import { Request, Response } from 'express';

import errorHandler from '../../utils/errorHandler';
import CourseService from './course.service';

class CourseController {
    async create(req: Request, res: Response) {
        try {
            const result = await CourseService.create(req.body);

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await CourseService.update({ id: req.params.id, courseData: req.body });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const result = await CourseService.getAll();

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const result = await CourseService.getOne({ id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const result = await CourseService.remove({ id: req.params.id });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new CourseController();