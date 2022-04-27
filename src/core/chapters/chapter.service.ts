import { Chapter } from './chapter.model';
import { Course } from '../courses/course.model';
import { Test } from '../tests/test.model';
import { Lecture } from '../lectures/lecture.model';

interface IChapterService {
    create: {
        title: string;
        course_id: string;
    },
    update: {
        id: string;
        data: { title: string };
    },
    getOne: {
        id: string;
    }
}

class ChapterService {
    async create({ title, course_id }: IChapterService['create']) {
        const candidate = await Chapter.findOne({ title }).exec();
        if ( candidate ) {
            return {
                status: 409,
                body: { message: 'Current chapter already exists.' }
            };
        }

        const chapter = new Chapter({ title });

        await Course.findByIdAndUpdate(
            course_id,
            { $push: { chapter: chapter._id } }
        ).exec();

        await chapter.save();

        return { status: 201, body: chapter };
    }

    async update({ id, data }: IChapterService['update']) {
        const candidate = await Chapter.findById(id).exec();
        if ( !candidate ) {
            return {
                status: 404,
                body: { message: 'Provided chapter doesn\'t exists.' }
            };
        }

        const chapter = await Chapter.findByIdAndUpdate(
            id,
            { title: data.title },
            { new: true }
        ).exec();

        return {
            status: 200,
            body: chapter
        };
    }

    async getAll() {
        const chapters = await Chapter.find().exec();

        return {
            status: 200,
            body: chapters
        };
    }

    async getOne({ id }: IChapterService['getOne']) {
        const chapter = await Chapter.findById(id).exec();

        return {
            status: 200,
            body: chapter
        }
    }

    async remove({ id }: IChapterService['getOne']) {
        const candidate = await Chapter.findById(id).exec();
        if ( !candidate ) {
            return {
                status: 404,
                body: { message: 'Provided chapter doesn\'t exists' }
            };
        }

        await candidate.remove();

        await Test.remove({
            _id: { '$in': candidate.subdivisions }
        }).exec();
        await Lecture.remove({
            _id: { '$in': candidate.subdivisions }
        }).exec();

        return { status: 200, body: { success: true } };
    }
}

export default new ChapterService();