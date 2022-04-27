import { Test } from './test.model';
import { Chapter } from '../chapters/chapter.model';
import { Unit } from '../units/unit.model';

interface ITestServiceArgs {
    _id?: string;
    title?: string;
    course?: string;
    chapter?: string;
}

class TestService {
    async create(data: ITestServiceArgs) {
        const candidate = await Test.findOne({
            $or: [{ title: data.title }, { course: data.course }]
        }).exec();

        if ( candidate ) {
            return {
                status: 409,
                body: { message: 'Current test already exists.' }
            };
        }

        const test = new Test({ ...data });

        await Chapter.findByIdAndUpdate(
            data.chapter,
            { $push: { subdivisions: { item: test._id, kind: 'tests' } } },
            { new: true }
        ).exec();

        await test.save();
        return { status: 201, body: test };
    }

    async update(data: ITestServiceArgs) {
        const test = await Test.findByIdAndUpdate(
            data._id,
            {
                $set: {
                    ...data
                }
            },
            { new: true }
        ).exec();

        return { status: 200, body: test };
    }

    async getAll() {
        const tests = await Test.find().exec();

        return { status: 200, body: tests };
    }

    async getOne({ _id }: ITestServiceArgs) {
        const test = await Unit.findById(_id).exec();

        return { status: 200, body: test };
    }

    async remove({ _id }: ITestServiceArgs) {
        const test = await Test.findByIdAndDelete(_id).exec();

        await Chapter.findOneAndUpdate({ subdivisions: { item: test._id } }, {
            $pullAll: { subdivisions: { item: test._id } }
        }, {
            new: true
        }).exec();

        return { status: 200, body: { success: true } };
    }
}

export default new TestService();