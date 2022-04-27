import { Router } from 'express';

import KeywordController from './keyword.controller';
import { upload } from 'middleware/upload.middleware';

const { create, getAll, getOne, remove, update } = KeywordController;

const router = Router();

router.post('/', upload.single('content'), create);
router.get('/:id', getOne);
router.patch('/:id', upload.single('content'), update);
router.delete('/:id', remove);
router.get('/', getAll);

export default router;