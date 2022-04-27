import { Router } from 'express';

import { create, getAll, getOne, remove, update } from './chapters.controller';
import { upload } from 'middleware/upload.middleware';

const router = Router();

router.post('/', upload.single('content'), create);
router.get('/:id', getOne);
router.patch('/:id', upload.single('content'), update);
router.delete('/:id', remove);
router.get('/', getAll);

export default router;