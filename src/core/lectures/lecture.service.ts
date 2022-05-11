import { S3 } from 'aws-sdk';
import crypto from 'crypto';
import 'dotenv/config';
import { JSDOM } from 'jsdom';
import mammoth from 'mammoth';
import { Chapter } from '../chapters/entities/chapter.entity';
import { Unit } from '../units/unit.entity';
import { Lecture } from './entities/lecture.entity';

interface ILectureArgs {
    id?: string;
    title?: string;
    fileId?: string;
    content?: Express.Multer.File[];
    chapter_id?: string;
    course_id?: string;
    units?: string;
}

class LectureService {
    s3 = new S3({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    awsBucketName = process.env.AWS_BUCKET as string;

    async uploadLectureFile(lecture: Buffer) {
        console.log(this.awsBucketName);
        const uploadParams = {
            Bucket: this.awsBucketName,
            Body: lecture,
            Key: crypto.randomBytes(20).toString('hex'),
        };

        return this.s3.upload(uploadParams).promise();
    }

    async removeLectureFile(id: string) {
        return this.s3
            .deleteObject(
                {
                    Bucket: this.awsBucketName,
                    Key: id,
                },
                (error) => {
                    if (!error) return true;
                },
            )
            .promise();
    }

    async downloadLectureFile(id: string) {
        return this.s3
            .getObject({ Bucket: this.awsBucketName, Key: id })
            .createReadStream();
    }

    async readLecture(id: string) {
        console.log('Read Lecture');
        return this.downloadLectureFile(id);
    }

    async editLecture(data: ILectureArgs) {
        const { id, content } = data;

        const lectureBuffer: Buffer | null = content?.length
            ? content[0].buffer
            : null;

        if (!lectureBuffer)
            return { status: 409, body: { message: 'No provided file' } };

        const lecture = await Lecture.findById(id).exec();

        if (!lecture) {
            return {
                status: 404,
                body: { message: 'Lecture not found.' },
            };
        }

        await this.removeLectureFile(lecture.fileId);

        const lectureFile = await this.uploadLectureFile(lectureBuffer);

        await lecture.update({ content: lectureFile.Key }).exec();

        return this.downloadLectureFile(lectureFile.Key);
    }

    async create(data: ILectureArgs) {
        const { title, content, chapter_id, course_id } = data;

        const rawContent = content?.length ? content[0] : null;

        if (!rawContent)
            return { status: 409, body: { message: 'No provided file' } };

        const candidate = await Lecture.findOne({ title }).exec();
        if (candidate) {
            return {
                status: 409,
                body: { message: 'Current lecture already exists.' },
            };
        }

        const cleanedLectureHtmlElm = await this.cleanLectureContent(
            rawContent.buffer,
        );

        const lectureBuffer = Buffer.from(
            cleanedLectureHtmlElm.innerHTML,
            'utf-8',
        );

        const uploadedLecture = await this.uploadLectureFile(lectureBuffer);

        const createdUnits = await this.createInitialUnits(
            cleanedLectureHtmlElm,
            course_id as string,
        );

        const lecture = new Lecture({
            title,
            fileId: uploadedLecture.Key,
            units: [...createdUnits].map(({ _id }) => _id),
        });

        await Chapter.findByIdAndUpdate(
            chapter_id,
            {
                $push: {
                    subdivisions: {
                        item: lecture._id,
                        subdivisionType: 'lectures',
                    },
                },
            },
            { new: true },
        ).exec();

        await lecture.save();

        return { status: 201, body: lecture };
    }

    async update(data: ILectureArgs) {
        const lecture = await Lecture.findById(data.id).exec();
        if (!lecture) {
            return {
                status: 404,
                body: { message: 'Provided lecture doesn`t exists.' },
            };
        }

        /*
        if ( JSON.parse(units)?.length ) {
            const existedUnits = await Unit.find({
                course: lectureValues.course,
            }).exec();
            const sortedUnits = [...existedUnits].sort((a, b) => {
                return a.title.localeCompare(b.title, undefined, {
                    numeric: true,
                    sensitivity: 'base',
                });
            });
            const newUnitsContent: string[] = [];
            const unitsToUpdate = sortedUnits
            .map(({ _id, title, content }, idx) => {
                if ( JSON.parse(units)[idx] !== content ) {
                    newUnitsContent.push(JSON.parse(units)[idx]);
                    return _id;
                }
            })
            .filter(Boolean);

            for ( const [idx, unit] of newUnitsContent.entries() ) {
                await Unit.updateOne(
                    {
                        _id: unitsToUpdate[idx],
                    },
                    {
                        $set: {
                            content: unit,
                        },
                    },
                ).exec();
            }
        }
        */

        const updatedLecture = await lecture
            .update({ ...data }, { new: true })
            .exec();

        return { status: 200, body: updatedLecture };
    }

    async getAll() {
        const lectures = await Lecture.find().exec();

        return { status: 200, body: lectures };
    }

    async getOne({ id }: { id: string }) {
        const lecture = await Lecture.findById(id).exec();

        if (!lecture) {
            return { status: 404, body: { message: 'Lecture not found' } };
        }

        return { status: 200, body: lecture };
    }

    async remove(id: string) {
        const candidate = await Lecture.findById(id).exec();
        if (!candidate) {
            return {
                status: 404,
                body: { message: 'Provided lecture doesn`t exists' },
            };
        }

        await this.removeLectureFile(candidate.fileId);
        await candidate.remove();

        return { status: 200, body: { success: true } };
    }

    async convertToHTML(buffer: Buffer) {
        return mammoth
            .convertToHtml({ buffer })
            .then(({ value }) =>
                value.replace(/(<(?!\/)((?!img)[^>])+>)+(<\/[^>]+>)+/g, ''),
            );
    }

    async cleanLectureContent(buffer: Buffer): Promise<HTMLBodyElement> {
        const htmlString = await this.convertToHTML(buffer);
        const htmlElement = new JSDOM(htmlString).window.document.querySelector(
            'body',
        ) as HTMLBodyElement;
        if (htmlElement && htmlElement.children) {
            htmlElement.innerHTML = [...htmlElement.children]
                .filter(
                    ({ textContent }) =>
                        textContent && !textContent.match(/^\s*$/),
                )
                .map(({ outerHTML }) => outerHTML)
                .join('');
        }
        return htmlElement;
    }

    async createInitialUnits(htmlBody: HTMLBodyElement, course_id: string) {
        const parsedUnits = [...htmlBody.children]
            .map(({ outerHTML, textContent }) => {
                if (textContent && !textContent.match(/^\s*$/)) {
                    const unitTitle = textContent.match(
                        /([^\s]+\s+[^\s]+|[^\s]+)/,
                    ) as RegExpMatchArray;

                    return {
                        title: `Unit "${unitTitle[1]
                            ?.replace(/\s+/g, ' ')
                            ?.trim()}"`,
                        content: outerHTML,
                        course_id,
                    };
                }
            })
            .filter(Boolean);

        const createdUnits = await Unit.insertMany([...parsedUnits]);

        return [...createdUnits];
    }
}

export default new LectureService();
