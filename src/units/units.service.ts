import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUnitDto, UpdateUnitDto } from "./dto/units.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Unit } from "./entities/unit.entity";
import { LecturesService } from "../lectures/lectures.service";
import { QuizzesService } from "../quizzes/quizzes.service";

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit) private readonly unitsRepository: typeof Unit,
    private readonly lecturesService: LecturesService,
    private readonly quizzesService: QuizzesService
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    try {
      if ( !createUnitDto.lectureId ) {
        throw new HttpException("Lecture is required", HttpStatus.BAD_REQUEST);
      }
      await this.lecturesService.findOne(createUnitDto.lectureId);
      if ( createUnitDto.quizQuestionId ) {
        // TODO: Refactor to find Question instead of the Quiz Instance
        await this.quizzesService.findOne(createUnitDto.quizQuestionId);
      }

      return this.unitsRepository.create(createUnitDto, { include: { all: true } });
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

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    try {
      if ( !updateUnitDto.lectureId ) {
        await this.lecturesService.findOne(updateUnitDto.lectureId);
      }
      if ( updateUnitDto.quizQuestionId ) {
        // TODO: Refactor to find Question instead of the Quiz Instance
        await this.quizzesService.findOne(updateUnitDto.quizQuestionId);
      }
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
        throw new HttpException("id is required!", HttpStatus.BAD_REQUEST);
      }
      const chapter = await this.unitsRepository.scope("withDeletedAt").findOne({ where: { id } });
      if ( !chapter ) {
        throw new HttpException("Chapter not found!", HttpStatus.NOT_FOUND);
      }

      await chapter.destroy();

      return { statusCode: HttpStatus.OK, message: "Success!" };
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }
}
