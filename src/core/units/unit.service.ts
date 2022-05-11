import { Chapter } from '../chapters/entities/chapter.entity';
import { Keyword } from '../keywords/entities/keyword.entity';
import { Unit } from './entities/unit.entity';

interface IUnitServiceArgs {
    _id: string;
    title: string;
    chapter: string;
    content: string;
    keywords: string[];
}

class UnitService {
    async create(data: IUnitServiceArgs) {
        const candidate = await Unit.findOne({ title: data.title }).exec();

        if (candidate) {
            return {
                status: 409,
                body: { message: 'Current unit already exists.' },
            };
        }

        const existedKeywords = await Keyword.find({
            title: {
                $in: data.keywords,
            },
        }).exec();

        const newKeywords = await Keyword.insertMany(
            data.keywords
                .filter(
                    (item) =>
                        !existedKeywords
                            .map(({ title }) => title)
                            .includes(item),
                )
                .map((item) => ({ title: item })),
        );

        const unit = new Unit({
            title: data.title,
            chapter: data.chapter,
            content: data.content,
            keywords: newKeywords
                .map((item) => item._id)
                .concat(existedKeywords.map((item) => item._id)),
        });

        await Chapter.findByIdAndUpdate(
            data.chapter,
            {
                $push: { units: unit._id },
            },
            { new: true },
        ).exec();

        await unit.save();
        return { status: 201, body: unit };
    }

    async update(data: IUnitServiceArgs) {
        const existedKeywords = await Keyword.find({
            title: {
                $in: data.keywords,
            },
        }).exec();

        const newKeywords = await Keyword.insertMany(
            data.keywords
                .filter(
                    (item) =>
                        !existedKeywords
                            .map(({ title }) => title)
                            .includes(item),
                )
                .map((item) => ({ title: item })),
        );

        const unit = await Unit.findByIdAndUpdate(
            data._id,
            {
                $set: {
                    ...data,
                    keywords: newKeywords
                        .map((item) => item._id)
                        .concat(existedKeywords.map((item) => item._id)),
                },
            },
            { new: true },
        )
            .populate('keywords')
            .exec();

        return { status: 200, body: unit };
    }

    async getAll() {
        const units = await Unit.find().exec();

        return { status: 200, body: units };
    }

    async getByLecture({ _id }: Partial<IUnitServiceArgs>) {
        const units = await Unit.find({ lecture: _id }).exec();

        return { status: 200, body: units };
    }

    async getOne({ _id }: Partial<IUnitServiceArgs>) {
        const unit = await Unit.findById(_id).exec();

        return { status: 200, body: unit };
    }

    async remove({ _id }: Partial<IUnitServiceArgs>) {
        const candidate = await Unit.findById(_id).exec();
        if (!candidate) {
            return {
                status: 404,
                body: { message: 'Provided unit doesn`t exists' },
            };
        }

        await candidate.remove();

        return { status: 200, body: { success: true } };
    }
}

export default new UnitService();
