import { Injectable } from "@nestjs/common";
import { CreateChapterDto, UpdateChapterDto } from "./dto/chapters.dto";

@Injectable()
export class ChaptersService {
  create(createChapterDto: CreateChapterDto) {
    return "This action adds a new chapter";
  }

  findAll() {
    return `This action returns all chapters`;
  }

  findById(id: number) {
    return `This action returns a #${ id } chapter`;
  }

  update(id: number, updateChapterDto: UpdateChapterDto) {
    return `This action updates a #${ id } chapter`;
  }

  remove(id: number) {
    return `This action removes a #${ id } chapter`;
  }
}
