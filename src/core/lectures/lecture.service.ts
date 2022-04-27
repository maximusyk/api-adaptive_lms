import { IChapter, ICourse, ILecture, IUnit } from '../../types'
import { Request, Response } from 'express';
import { Lecture } from './lecture.model';
import { Unit } from '../units/unit.model';
import { Chapter } from '../chapters/chapter.model';
import errorHandler from '../../utils/errorHandler';
import mongoose from 'mongoose';

interface ILectureArgs {
    id?: string;
    title: string;
    content: { id: string };
    chapter: IChapter['_id'];
    course: ICourse['_id'];
    units: string;
}

interface ILectureService {
    create(data: ILectureArgs): Promise<{
        status: number, body: ILecture | { message: string }
    }>;

    update(data: ILectureArgs): Promise<{
        status: number, body: ILecture | { message: string }
    }>;
}

class LectureService implements ILectureService {
    async create(data: ILectureArgs): Promise<{ status: number, body: ILecture | { message: string } }> {
        const { title, content: { id: fileId }, chapter, course, units } = data;

        const candidate = await Lecture.findOne({ title }).exec();
        if ( candidate ) {
            return { status: 409, body: { message: 'Current lecture already exists.' } };
        }

        const preparedUnits = JSON.parse(units)?.map((unit: string, id: number) => ({
            title: `unit_${title?.slice(0, 5)?.toLowerCase()}_${id + 1}`,
            content: unit,
            course
        }));

        // @ts-ignore
        const createdUnits: IUnit[] = await Unit.create([...preparedUnits]);

        const lecture = new Lecture({
            title,
            content: fileId,
            units: [...createdUnits].map(({ _id }) => _id)
        });

        await Chapter.findByIdAndUpdate(
            chapter,
            { $push: { subdivisions: { item: lecture._id, kind: 'lecture' } } },
            { new: true }
        ).exec();

        await lecture.save();

        return { status: 201, body: lecture };
    }

    async update(data: ILectureArgs) {
        const lecture = await Lecture.findById(id).exec();
        if ( !lecture ) {
            return { status: 404, body: { message: 'Provided lecture doesn\'t exists.' } };
        }

        const { units, ...lectureValues } = data;

        if ( JSON.parse(units)?.length ) {
            const existedUnits = await Unit.find({ course: lectureValues.course }).exec();
            const sortedUnits = [...existedUnits].sort((a, b) => {
                return a.title.localeCompare(b.title, undefined, {
                    numeric: true,
                    sensitivity: 'base'
                });
            });
            const newUnitsContent: string[] = [];
            const unitsToUpdate = sortedUnits.map(({ _id, title, content }, idx) => {
                if ( JSON.parse(units)[idx] !== content ) {
                    newUnitsContent.push(JSON.parse(units)[idx]);
                    return _id;
                }
            }).filter(Boolean);

            for ( const [idx, unit] of newUnitsContent.entries() ) {
                await Unit.updateOne({
                        _id: unitsToUpdate[idx]
                    }, {
                        '$set': {
                            content: unit
                        }
                    }
                ).exec();
            }
        }
        if ( fileId ) {
            gfs.delete(new mongoose.Types.ObjectId(lecture.content), (err) => {
                if ( err ) {
                    return res.status(500).json({ message: 'Chapter deletion error', err: err });
                }
            });
            lecture.content = fileId;
        }

        // @ts-ignore
        lecture.title = lectureValues?.title || lecture.title;

        await lecture.save();

        gfs.find({ _id: fileId || new mongoose.Types.ObjectId(lecture.content) }).toArray((err, files) => {
            if ( !files || files.length === 0 ) {
                return res.status(400).json({ msg: 'No files found.' });
            }
            const fileStream = gfs.openDownloadStream(fileId);
            let responseFile: Uint8Array[] = [];
            fileStream.on('data', (chunk) => {
                responseFile.push(chunk);
            });

            fileStream.on('error', () => {
                return res.sendStatus(404);
            });

            fileStream.on('end', () => {
                //@ts-ignore
                return res.status(200).json({ ...lecture._doc, content: Buffer.concat(responseFile) });
            });
        });
    }

    async getAll(req: Request, res: Response) {
        try {
            const lectures = await Lecture.find().exec();

            return res.status(200).json(lectures);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async getOne({ params: { id } }: Request, res: Response) {
        try {
            const lectures = await Lecture.findById(id).exec();

            return res.status(200).json(lectures);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async remove({ params: { id } }: Request, res: Response) {
        try {
            const lecture = await Lecture.findById(id).exec();
            if ( !lecture ) {
                return res.status(404).json({
                    message: 'Provided lecture doesn\'t exists.'
                });
            }

            gfs.delete(new mongoose.Types.ObjectId(lecture.content), (err) => {
                if ( err ) {
                    return res.status(500).json({ message: 'Lecture deletion error', err: err });
                }
            });

            await lecture.remove();
            const updatedChapter = await Chapter.findOneAndUpdate({ subdivisions: { item: lecture.id } }, {
                $pullAll: { subdivisions: { item: lecture.id } }
            }, {
                new: true
            }).exec();

            if ( updatedChapter ) {
                await Unit.remove({ chapter: updatedChapter._id }).exec();
            }

            return res.status(200).json({ success: true });
        } catch ( error ) {
            errorHandler(res, error);
        }
    }
}

export default new LectureService();