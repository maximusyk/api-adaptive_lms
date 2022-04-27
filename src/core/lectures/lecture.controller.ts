import { Request, Response } from 'express';
import mongoose from 'mongoose';
import config from 'config';
import { GridFSBucket } from 'mongodb';

import { Lecture } from './lecture.model'
import { Chapter } from '../chapters/chapter.model'
import { Unit } from '../units/unit.model'
import errorHandler from '../../utils/errorHandler';
import { IUnit } from '../../types';
import LectureService from './lecture.service';

const mongoURI: string = config.get('mongoURI');

const conn = mongoose.createConnection(mongoURI);

let gfs: GridFSBucket;

conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'lectures'
    });
});

class LectureController {
    async create(req: Request, res: Response) {
        try {
            const result = await LectureService.create({ ...req.body, content: req.file });

            return res.status(result.status).json(result.body);
        } catch ( error ) {
            errorHandler(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const lecture = await Lecture.findById(req.params.id).exec();
            if ( !lecture ) {
                return res.status(404).json({
                    message: 'Provided lecture doesn\'t exists.'
                });
            }
            const { units, ...lectureValues } = req.body;
            // @ts-ignore
            const { id: fileId } = req.file;

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
        } catch ( error ) {
            errorHandler(res, error);
        }
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

export default new LectureController();