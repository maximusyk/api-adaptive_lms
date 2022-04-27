import { Router } from 'express';

import ClassController from './class.controller';

const router = Router();
const { create, getAll, getOne, remove, update } = ClassController;

router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);
router.get('/', getAll);

export default router;