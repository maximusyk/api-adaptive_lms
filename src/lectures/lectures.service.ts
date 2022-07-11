import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateLectureDto, UpdateLectureDto } from './dto/lectures.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Lecture } from './entities/lecture.entity';
import { ConfigService } from '@nestjs/config';
import { AwsService } from '../aws/aws.service';
import mammoth from 'mammoth';
import { UnitsService } from '../units/units.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LecturesService {
    constructor(
        @InjectModel(Lecture) private readonly lecturesRepository: typeof Lecture,
        private readonly configService: ConfigService,
        private readonly awsService: AwsService,
        @Inject(forwardRef(() => UnitsService))
        private readonly unitsService: UnitsService
    ) {}

    async create(createLectureDto: CreateLectureDto) {
        try {
            const cleanedContent = await this.cleanLectureContent(createLectureDto.lectureFile.buffer);
            const uploadedLectureKey = await this.awsService.uploadFile(
                createLectureDto.lectureFile.originalname,
                Buffer.from(cleanedContent, 'utf8')
            );

            const lectureId = uuidv4();

            await this.unitsService.createFromLectureContent(lectureId, cleanedContent);

            return this.lecturesRepository.create(
                {
                    ...createLectureDto,
                    id: lectureId,
                    fileId: uploadedLectureKey
                },
                { include: { all: true } }
            );
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async readLectureS3(id: string) {
        try {
            return this.awsService.getFileStream(id);
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async editLectureS3(id: string, file: Express.Multer.File) {
        try {
            const newFileKey = await this.awsService.updateFile(id, file.buffer);

            return this.awsService.getFileStream(newFileKey);
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findAll() {
        try {
            return this.lecturesRepository.findAll({ include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string) {
        try {
            return this.lecturesRepository.findByPk(id, { include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateLectureDto: UpdateLectureDto) {
        try {
            return this.lecturesRepository.update(updateLectureDto, { where: { id } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string) {
        try {
            if ( !id ) {
                throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);
            }
            const chapter = await this.lecturesRepository.scope('withDeletedAt').findOne({ where: { id } });
            if ( !chapter ) {
                throw new HttpException('Chapter not found!', HttpStatus.NOT_FOUND);
            }

            await chapter.destroy();

            return { statusCode: HttpStatus.OK, message: 'Success!' };
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async convertToHTML(buffer: Buffer): Promise<string> {
        return mammoth.convertToHtml({ buffer }).then(({ value }) =>
            value.replace(/(<(?!\/)((?!img)[^>])+>)+(<\/[^>]+>)+/g, '')
        );
    }

    async cleanLectureContent(buffer: Buffer): Promise<string> {
        const htmlString = await this.convertToHTML(buffer);
        const domParser = new DOMParser();
        const htmlElement = domParser.parseFromString(htmlString, 'text/html').body as HTMLBodyElement;

        if ( htmlElement && htmlElement.children ) {
            const cleanedChildren = Array.from(htmlElement.children).filter((child) => {
                return child.textContent && !child.textContent.match(/^\s*$/);
            });
            htmlElement.innerHTML = cleanedChildren.map((child) => child.outerHTML).join('');
        }
        return htmlElement.innerHTML;
    }
}
