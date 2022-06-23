import { Injectable } from "@nestjs/common";
import { CreateUnitDto, UpdateUnitDto } from "./dto/units.dto";

@Injectable()
export class UnitsService {
  create(createUnitDto: CreateUnitDto) {
    return "This action adds a new unit";
  }

  findAll() {
    return `This action returns all units`;
  }

  findOne(id: number) {
    return `This action returns a #${ id } unit`;
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return `This action updates a #${ id } unit`;
  }

  remove(id: number) {
    return `This action removes a #${ id } unit`;
  }
}