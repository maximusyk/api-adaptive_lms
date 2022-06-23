import { Injectable } from "@nestjs/common";
import { CreateRoleDto, UpdateRoleDto } from "./dto/roles.dto";

@Injectable()
export class RolesService {
  create(createRoleDto: CreateRoleDto) {
    return "This action adds a new role";
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${ id } role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${ id } role`;
  }

  remove(id: number) {
    return `This action removes a #${ id } role`;
  }
}
