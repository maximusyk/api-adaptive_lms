import { Injectable } from '@nestjs/common';
import { CreateLectureReferenceDto } from './dto/create-lecture-reference.dto';
import { UpdateLectureReferenceDto } from './dto/update-lecture-reference.dto';

@Injectable()
export class LectureReferencesService {
  create(createLectureReferenceDto: CreateLectureReferenceDto) {
    return 'This action adds a new lectureReference';
  }

  findAll() {
    return `This action returns all lectureReferences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lectureReference`;
  }

  update(id: number, updateLectureReferenceDto: UpdateLectureReferenceDto) {
    return `This action updates a #${id} lectureReference`;
  }

  remove(id: number) {
    return `This action removes a #${id} lectureReference`;
  }
}
