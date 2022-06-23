import { Injectable } from "@nestjs/common";
import { CreateQuizDto, UpdateQuizDto } from "./dto/quizzes.dto";

@Injectable()
export class QuizzesService {
  create(createQuizDto: CreateQuizDto) {
    return "This action adds a new quiz";
  }

  findAll() {
    return `This action returns all quizzes`;
  }

  findOne(id: number) {
    return `This action returns a #${ id } quiz`;
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${ id } quiz`;
  }

  remove(id: number) {
    return `This action removes a #${ id } quiz`;
  }
}
