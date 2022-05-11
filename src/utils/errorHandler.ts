import { Response } from 'express';

export default (res: Response, error: Error | unknown) => {
    res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : error,
    });
};
