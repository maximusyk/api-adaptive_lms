import { Injectable } from "@nestjs/common";
import { CreateGroupDto, UpdateGroupDto } from "./dto/groups.dto";

@Injectable()
export class GroupsService {
  create(createGroupDto: CreateGroupDto) {
    return "This action adds a new group";
  }

  findAll() {
    return `This action returns all groups`;
  }

  findOne(id: number) {
    return `This action returns a #${ id } group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${ id } group`;
  }

  remove(id: number) {
    return `This action removes a #${ id } group`;
  }
}
