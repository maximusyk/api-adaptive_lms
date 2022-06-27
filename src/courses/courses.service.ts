import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateCourseDto, UpdateCourseDto } from "./dto/courses.dto";
import { Course } from "./entities/course.entity";
import { ChaptersService } from "../chapters/chapters.service";
import { InjectModel } from "@nestjs/sequelize";
import { UsersService } from "../users/users.service";
import { RoleEnum } from "../roles/enums/role.enum";

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course) private readonly courseRepository: typeof Course,
    @Inject(forwardRef(() => ChaptersService))
    private readonly chapterService: ChaptersService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      if ( !createCourseDto.professorId ) {
        throw new HttpException("Professor is required", HttpStatus.BAD_REQUEST);
      }

      await this.usersService.checkRole(createCourseDto.professorId, RoleEnum.PROFESSOR);

      return this.courseRepository.create(createCourseDto, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return this.courseRepository.findAll({ include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      return this.courseRepository.findByPk(id, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      if ( updateCourseDto.professorId ) {
        await this.usersService.checkRole(updateCourseDto.professorId, RoleEnum.PROFESSOR);
      }
      return this.courseRepository.update(updateCourseDto, { where: { id } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if ( !id ) {
        throw new HttpException("id is required!", HttpStatus.BAD_REQUEST);
      }
      const chapter = await this.courseRepository.scope("withDeletedAt").findOne({ where: { id } });
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
