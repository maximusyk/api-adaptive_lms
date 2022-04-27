import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import randomColor from 'randomcolor';

import { User } from './user.model'
import { Class } from '../classes/class.model'
import errorHandler from '../../utils/errorHandler';
import UserService from './user.service';

class UserController {
    async login(req: Request, res: Response) {
        const errors = validationResult(req);
        if ( !errors.isEmpty() ) {
            return res.status(422).json({ errors: errors.array() });
        }

        const result = await UserService.login(req.body);

        return res.status(result.status).json({ ...result.body });
    }

    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if ( !errors.isEmpty() ) {
                return res.status(422).json({
                    errors: errors.array(),
                    message: 'Wrong data',
                });
            }

            const result = await UserService.create(req.body);

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await UserService.update({ userData: { _id: req.params.id, ...req.body } });
            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const result = await UserService.getAll();

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const result = await UserService.getOne({ userData: { _id: req.params.id } });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const result = await UserService.remove({ userData: { _id: req.params.id } });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new UserController();