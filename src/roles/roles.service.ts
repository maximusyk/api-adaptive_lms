import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateRoleDto, UpdateRoleDto } from "./dto/roles.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./entities/role.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly rolesRepository: typeof Role
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      return this.rolesRepository.create(createRoleDto, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return this.rolesRepository.findAll({ include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      return this.rolesRepository.findByPk(id, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      return this.rolesRepository.update(updateRoleDto, { where: { id } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if ( !id ) {
        throw new HttpException("id is required!", HttpStatus.BAD_REQUEST);
      }
      const chapter = await this.rolesRepository.scope("withDeletedAt").findOne({ where: { id } });
      if ( !chapter ) {
        throw new HttpException("Chapter not found!", HttpStatus.NOT_FOUND);
      }

      await chapter.destroy();

      return { statusCode: HttpStatus.OK, message: "Success!" };
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }
}
