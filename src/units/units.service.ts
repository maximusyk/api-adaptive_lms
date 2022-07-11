import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUnitDto, UnitEntityDto, UpdateUnitDto } from './dto/units.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Unit } from './entities/unit.entity';
import { LecturesService } from '../lectures/lectures.service';
import { QuizzesService } from '../quizzes/quizzes.service';

@Injectable()
export class UnitsService {
    constructor(
        @InjectModel(Unit) private readonly unitsRepository: typeof Unit,
        @Inject(forwardRef(() => LecturesService))
        private readonly lecturesService: LecturesService,
        private readonly quizzesService: QuizzesService
    ) {}

    async create(createUnitDto: CreateUnitDto) {
        try {
            if ( !createUnitDto.lectureId ) {
                throw new HttpException('Lecture is required', HttpStatus.BAD_REQUEST);
            }
            await this.lecturesService.findOne(createUnitDto.lectureId);

            return this.unitsRepository.create(createUnitDto, { include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async createFromLectureContent(lectureId: string, content: string): Promise<void> {
        try {
            await this.lecturesService.findOne(lectureId);

            if ( !content ) throw new HttpException('Content is required!', HttpStatus.BAD_REQUEST);
            if ( !content.length ) throw new HttpException('Content is empty!', HttpStatus.BAD_REQUEST);

            const preparedUnits = this.prepareUnitsFromLecture(lectureId, content);

            await this.unitsRepository.bulkCreate(preparedUnits);
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findAll() {
        try {
            return this.unitsRepository.findAll({ include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string) {
        try {
            return this.unitsRepository.findByPk(id, { include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findByLectureId(id: string) {
        try {
            return this.unitsRepository.findOne({ where: { lectureId: id }, include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateUnitDto: UpdateUnitDto) {
        try {
            if ( !updateUnitDto.lectureId ) {
                await this.lecturesService.findOne(updateUnitDto.lectureId);
            }
            // if ( updateUnitDto.quizQuestionId ) {
            //     // TODO: Refactor to find Question instead of the Quiz Instance
            //     await this.quizzesService.findOne(updateUnitDto.quizQuestionId);
            // }
            if ( updateUnitDto.cohesionUnits ) {
                //  TODO: Implement to set cohesion units
            }
            return this.unitsRepository.update(updateUnitDto, { where: { id } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string) {
        try {
            if ( !id ) {
                throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);
            }
            const chapter = await this.unitsRepository.scope('withDeletedAt').findOne({ where: { id } });
            if ( !chapter ) {
                throw new HttpException('Chapter not found!', HttpStatus.NOT_FOUND);
            }

            await chapter.destroy();

            return { statusCode: HttpStatus.OK, message: 'Success!' };
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    prepareUnitsFromLecture(lectureId: string, lectureContent: string): Pick<UnitEntityDto, 'title' | 'content' | 'lectureId'>[] {
        const domParser = new DOMParser();
        const htmlBody = domParser.parseFromString(lectureContent, 'text/html').body as HTMLBodyElement;
        const unitsContent = Array.from(htmlBody.children).map((child) => child.outerHTML).filter(Boolean);

        const preparedUnits: Pick<UnitEntityDto, 'title' | 'content' | 'lectureId'>[] = [];

        unitsContent.forEach((unitContent) => {
            const unitTitle = unitContent.match(/(\S+\s+\S+|\S+)/)?.at(1)?.replace(/\s+/g, ' ')?.trim();
            const unit = {
                title: `Unit ${ unitTitle }`,
                content: unitContent,
                lectureId: lectureId
            };
            preparedUnits.push(unit);
        });

        return preparedUnits;
    }
}
