import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateLectureDto, UpdateLectureDto } from "./dto/lectures.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Lecture } from "./entities/lecture.entity";

@Injectable()
export class LecturesService {
  constructor(
    @InjectModel(Lecture) private readonly lecturesRepository: typeof Lecture
  ) {}

  async create(createLectureDto: CreateLectureDto) {
    try {
      return this.lecturesRepository.create(createLectureDto, { include: { all: true } });
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
        throw new HttpException("id is required!", HttpStatus.BAD_REQUEST);
      }
      const chapter = await this.lecturesRepository.scope("withDeletedAt").findOne({ where: { id } });
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
