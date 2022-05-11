import { Keyword } from './entities/keyword.entity';

interface IKeywordService {
    id?: string;
    title?: string;
    keywordData?: {
        title?: string;
    };
}

class KeywordService {
    async create({ title }: IKeywordService) {
        const candidate = await Keyword.findOne({ title }).exec();

        if (candidate) {
            return {
                status: 409,
                body: { message: 'Current keyword already exists.' },
            };
        }

        const keyword = new Keyword({
            title,
        });

        await keyword.save();

        return { status: 201, body: keyword };
    }

    async update({ id, keywordData }: IKeywordService) {
        const keyword = await Keyword.findByIdAndUpdate(
            id,
            {
                $set: { ...keywordData },
            },
            { new: true },
        ).exec();

        return { status: 200, body: keyword };
    }

    async getAll() {
        const keywords = await Keyword.find().exec();

        return { status: 200, body: keywords };
    }

    async getOne({ id }: IKeywordService) {
        const keyword = await Keyword.find({ chapter: id }).exec();

        return { status: 200, body: keyword };
    }

    async remove({ id }: IKeywordService) {
        const candidate = await Keyword.findById(id).exec();
        if (!candidate) {
            return {
                status: 404,
                body: { message: 'Provided keyword doesn`t exists' },
            };
        }

        await candidate.remove();

        return { status: 200, body: { success: true } };
    }
}

export default new KeywordService();
