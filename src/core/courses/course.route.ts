import { Router } from 'express';

import CourseController from './course.controller';

const { create, getAll, getOne, remove, update } = CourseController;

const router = Router();

router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);
router.get('/', getAll);

export default router;