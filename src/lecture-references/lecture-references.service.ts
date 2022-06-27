import { Injectable } from "@nestjs/common";
import { CreateLectureReferenceDto } from "./dto/create-lecture-reference.dto";
import { UpdateLectureReferenceDto } from "./dto/update-lecture-reference.dto";

@Injectable()
export class LectureReferencesService {
  async create(createLectureReferenceDto: CreateLectureReferenceDto) {
    return "This action adds a new lectureReference";
  }

  async findAll() {
    return `This action returns all lectureReferences`;
  }

  async findOne(id: string) {
    return `This action returns a #${ id } lectureReference`;
  }

  async update(id: string, updateLectureReferenceDto: UpdateLectureReferenceDto) {
    return `This action updates a #${ id } lectureReference`;
  }

  async remove(id: string) {
    return `This action removes a #${ id } lectureReference`;
  }
}
