import { Injectable } from "@nestjs/common";
import { CreateCourseDto, UpdateCourseDto } from "./dto/courses.dto";

@Injectable()
export class CoursesService {
  create(createCourseDto: CreateCourseDto) {
    return "This action adds a new course";
  }

  findAll() {
    return `This action returns all courses`;
  }

  findOne(id: number) {
    return `This action returns a #${ id } course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${ id } course`;
  }

  remove(id: number) {
    return `This action removes a #${ id } course`;
  }
}
