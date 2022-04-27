import { Router } from 'express';

import ChapterController from './chapter.controller';

const router = Router();
const { create, getAll, getOne, remove, update } = ChapterController;

router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);
router.get('/', getAll);

export default router;