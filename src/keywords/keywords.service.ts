import { Injectable } from "@nestjs/common";
import { CreateKeywordDto } from "./dto/create-keyword.dto";
import { UpdateKeywordDto } from "./dto/update-keyword.dto";

@Injectable()
export class KeywordsService {
  async create(createKeywordDto: CreateKeywordDto) {
    return "This action adds a new keyword";
  }

  async findAll() {
    return `This action returns all keywords`;
  }

  async findOne(id: string) {
    return `This action returns a #${ id } keyword`;
  }

  async update(id: string, updateKeywordDto: UpdateKeywordDto) {
    return `This action updates a #${ id } keyword`;
  }

  async remove(id: string) {
    return `This action removes a #${ id } keyword`;
  }
}
