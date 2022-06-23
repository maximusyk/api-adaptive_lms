import { Injectable } from "@nestjs/common";
import { CreateTokenDto, UpdateTokenDto } from "./dto/tokens.dto";

@Injectable()
export class TokensService {
  create(createTokenDto: CreateTokenDto) {
    return "This action adds a new token";
  }

  findAll() {
    return `This action returns all tokens`;
  }

  findOne(id: number) {
    return `This action returns a #${ id } token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${ id } token`;
  }

  remove(id: number) {
    return `This action removes a #${ id } token`;
  }
}
