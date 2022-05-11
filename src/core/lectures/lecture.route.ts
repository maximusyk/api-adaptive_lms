import { Router } from 'express';
import LectureController from './lecture.controller';

const { create, getAll, readLecture, editLecture, getOne, remove, update } =
    LectureController;

const router = Router();

router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);
router.get('/', getAll);
router.get('/file/:id', readLecture);
router.patch('/file/:id', editLecture);

export default router;
