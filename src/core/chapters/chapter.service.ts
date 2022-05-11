import { IChapter } from 'types';
import { Course } from '../courses/entities/course.entity';
import { Lecture } from '../lectures/entities/lecture.entity';
import { Test } from '../tests/entities/tests.entity';
import { Chapter } from './entities/chapter.entity';

interface IChapterService {
    create: {
        title: string;
        course_id: string;
    };
    update: {
        id: string;
        data: { title: string };
    };
    getOne: {
        id: string;
    };
}

class ChapterService {
    async create({ title, course_id }: IChapterService['create']) {
        const candidate = await Chapter.findOne({ title }).exec();
        if (candidate) {
            return {
                status: 409,
                body: { message: 'Current chapter already exists.' },
            };
        }

        const chapter = new Chapter({ title });

        await Course.findByIdAndUpdate(course_id, {
            $push: { chapters: chapter._id },
        }).exec();

        await chapter.save();

        return { status: 201, body: chapter };
    }

    async update({ id, data }: IChapterService['update']) {
        const candidate = await Chapter.findById(id).exec();
        if (!candidate) {
            return {
                status: 404,
                body: { message: 'Provided chapter doesn`t exists.' },
            };
        }

        const chapter = await Chapter.findByIdAndUpdate(
            id,
            { title: data.title },
            { new: true },
        ).exec();

        return {
            status: 200,
            body: chapter,
        };
    }

    async getAll() {
        const chapters = await Chapter.find().exec();

        return {
            status: 200,
            body: chapters,
        };
    }

    async getOne({ id }: IChapterService['getOne']) {
        const chapter = await Chapter.findById(id).exec();

        if (!chapter) {
            return {
                status: 404,
                body: { message: 'Provided chapter doesn`t exists.' },
            };
        }

        const populatedChapter: IChapter = {
            ...chapter._doc,
            subdivisions: [],
        };

        for (const { item, subdivisionType } of chapter.subdivisions) {
            const subdivisionData: ILecture | ITest =
                subdivisionType === 'lectures'
                    ? await Lecture.findById(item).exec()
                    : await Test.findById(item).exec();

            if (subdivisionData) {
                populatedChapter.subdivisions.push({
                    item: {
                        _id: subdivisionData?.fileId || subdivisionData._id,
                        title: subdivisionData.title,
                    },
                    subdivisionType,
                });
            }
        }

        return {
            status: 200,
            body: populatedChapter,
        };
    }

    async remove({ id }: IChapterService['getOne']) {
        const candidate = await Chapter.findById(id).exec();
        if (!candidate) {
            return {
                status: 404,
                body: { message: 'Provided chapter doesn`t exists' },
            };
        }

        await candidate.remove();

        return { status: 200, body: { success: true } };
    }
}

export default new ChapterService();
