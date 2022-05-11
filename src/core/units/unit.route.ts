import { Router } from 'express';

import UnitController from './unit.controller';

const { create, getAll, getOne, remove, update } = UnitController;

const router = Router();

router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);
router.get('/', getAll);

export default router;