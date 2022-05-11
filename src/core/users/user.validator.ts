import { check } from 'express-validator';

export const userValidator = {
    login: [
        check('username')
            .isLength({ min: 5 })
            .withMessage('Username must be at least 5 characters'),
        check('password')
            .exists()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ]
};