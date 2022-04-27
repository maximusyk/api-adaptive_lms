import { IChapter, ICourse, IUnit } from '../../types';
import { Lecture } from './lecture.model';
import { Unit } from '../units/unit.model';
import { Chapter } from '../chapters/chapter.model';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import 'dotenv/config';

const mongoURI: string = process.env.MONGODB_URI as string;

const conn = mongoose.createConnection(mongoURI);

let gfs: GridFSBucket;

conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'lectures'
    });
});

interface ILectureArgs {
    id?: string;
    title: string;
    fileId: string;
    chapter: IChapter['_id'];
    course: ICourse['_id'];
    units: string;
}

class LectureService {
    async create(data: ILectureArgs) {
        const { title, fileId, chapter, course, units } = data;

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
        const { id, fileId, units, ...lectureValues } = data;
        const lecture = await Lecture.findById(id).exec();
        if ( !lecture ) {
            return { status: 404, body: { message: 'Provided lecture doesn\'t exists.' } };
        }

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
                    return { status: 500, body: { message: 'Chapter deletion error.' } };
                }
            });
            lecture.content = fileId;
        }

        // @ts-ignore
        lecture.title = lectureValues?.title || lecture.title;

        await lecture.save();

        gfs.find({ _id: new mongoose.Types.ObjectId(lecture.content) }).toArray((err, files) => {
            if ( !files || files.length === 0 ) {
                return { status: 400, body: { message: 'File not found' } };
            }
            const fileStream = gfs.openDownloadStream(fileId);
            let responseFile: Uint8Array[] = [];
            fileStream.on('data', (chunk) => {
                responseFile.push(chunk);
            });

            fileStream.on('error', () => {
                return { status: 404, body: { message: 'File not found' } };
            });

            fileStream.on('end', () => {
                //@ts-ignore
                return {
                    status: 200,
                    body: {
                        ...lecture, content: Buffer.concat(responseFile)
                    }
                };
            });
        });
    }

    async getAll() {
        const lectures = await Lecture.find().exec();

        return { status: 200, body: lectures };
    }

    async getOne({ id }: { id: string }) {
        const lecture = await Lecture.findById(id).exec();

        return { status: 200, body: lecture };
    }

    async remove({ id }: { id: string }) {
        const lecture = await Lecture.findById(id).exec();
        if ( !lecture ) {
            return { status: 404, body: { message: 'Provided lecture doesn\'t exists.' } };
        }

        gfs.delete(new mongoose.Types.ObjectId(lecture.content), (err) => {
            if ( err ) {
                return { status: 500, body: { message: 'Lecture deletion error' } };
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

        return { status: 200, body: { success: true } };
    }
}

export default new LectureService();