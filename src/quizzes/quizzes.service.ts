import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateQuizDto, UpdateQuizDto } from "./dto/quizzes.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Quiz } from "./entities/quiz.entity";
import { ChaptersService } from "../chapters/chapters.service";
import { CoursesService } from "../courses/courses.service";

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz) private readonly quizRepository: typeof Quiz,
    private readonly chaptersService: ChaptersService,
    private readonly coursesService: CoursesService
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    try {
      if ( !createQuizDto.chapterId ) {
        throw new HttpException("Chapter is required", HttpStatus.BAD_REQUEST);
      }
      await this.chaptersService.findById(createQuizDto.chapterId);

      return this.quizRepository.create(createQuizDto, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return this.quizRepository.findAll({ include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      return this.quizRepository.findByPk(id, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    try {
      // if ( updateQuizDto.professorId ) {
      //   await this.usersService.checkRole(updateQuizDto.professorId, RoleEnum.PROFESSOR);
      // }
      return this.quizRepository.update(updateQuizDto, { where: { id } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if ( !id ) {
        throw new HttpException("id is required!", HttpStatus.BAD_REQUEST);
      }
      const chapter = await this.quizRepository.scope("withDeletedAt").findOne({ where: { id } });
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
