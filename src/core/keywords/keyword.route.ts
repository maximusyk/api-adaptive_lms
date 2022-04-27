import { Router } from 'express';

import KeywordController from './keyword.controller';

const { create, getAll, getOne, remove, update } = KeywordController;

const router = Router();

router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);
router.get('/', getAll);

export default router;