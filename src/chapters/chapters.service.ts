import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateChapterDto, UpdateChapterDto } from "./dto/chapters.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Chapter } from "./entities/chapter.entity";
import { CoursesService } from "../courses/courses.service";

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter) private readonly chapterRepository: typeof Chapter,
    @Inject(forwardRef(() => CoursesService))
    private readonly courseService: CoursesService
  ) {}

  async create(createChapterDto: CreateChapterDto) {
    try {
      if ( !createChapterDto.courseId ) {
        throw new HttpException("Course is required", HttpStatus.BAD_REQUEST);
      }

      this.courseService.findOne(createChapterDto.courseId);

      return this.chapterRepository.create(createChapterDto, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return this.chapterRepository.findAll({ include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  findById(id: string) {
    try {
      return this.chapterRepository.findByPk(id, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateChapterDto: UpdateChapterDto) {
    try {
      if ( updateChapterDto.courseId ) {
        this.courseService.findOne(updateChapterDto.courseId);
      }
      return this.chapterRepository.update(updateChapterDto, { where: { id } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if ( !id ) {
        throw new HttpException("id is required!", HttpStatus.BAD_REQUEST);
      }
      const chapter = await this.chapterRepository.scope("withDeletedAt").findOne({ where: { id } });
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
