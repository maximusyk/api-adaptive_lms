import { Response } from 'express';

export default (res: Response, error: Error | any) => {
  console.log(error.message ? error.message : error);
  res
    .status(500)
    .json({ success: false, message: error.message ? error.message : error });
};
