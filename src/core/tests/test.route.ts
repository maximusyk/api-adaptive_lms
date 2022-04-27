import { Router } from 'express';

import TestController from './test.controller';

const { create, getAll, getOne, remove, update } = TestController;

const router = Router();

router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);
router.get('/', getAll);

export default router;