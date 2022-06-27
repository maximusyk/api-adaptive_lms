import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "./dto/users.dto";
import { RoleEnum } from "../roles/enums/role.enum";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./entities/user.entity";
import { GroupsService } from "../groups/groups.service";
import { RolesService } from "../roles/roles.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    @Inject(forwardRef(() => GroupsService))
    private readonly groupsService: GroupsService,
    private readonly rolesService: RolesService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      if ( createUserDto.groupId ) {
        await this.groupsService.findOne(createUserDto.groupId);
      }
      if ( createUserDto.roleId ) {
        await this.rolesService.findOne(createUserDto.roleId);
      }

      return this.userRepository.create(createUserDto, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return this.userRepository.findAll({ include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      return this.userRepository.findByPk(id, { include: { all: true } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if ( updateUserDto.groupId ) {
        await this.groupsService.findOne(updateUserDto.groupId);
      }
      if ( updateUserDto.roleId ) {
        await this.rolesService.findOne(updateUserDto.roleId);
      }
      return this.userRepository.update(updateUserDto, { where: { id } });
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async checkRole(id: string, role: RoleEnum) {
    try {
      if ( !id ) {
        throw new HttpException("id is required!", HttpStatus.BAD_REQUEST);
      }

      if ( !role ) {
        throw new HttpException("role is required!", HttpStatus.BAD_REQUEST);
      }

      const user = await this.userRepository.findByPk(id, { include: { all: true } });

      if ( !user ) {
        throw new HttpException("User not found!", HttpStatus.NOT_FOUND);
      }

      if ( user.role.name !== role ) {
        throw new HttpException("User does not have the required role!", HttpStatus.FORBIDDEN);
      }

      return true;
    } catch ( error ) {
      throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      if ( !id ) {
        throw new HttpException("id is required!", HttpStatus.BAD_REQUEST);
      }
      const chapter = await this.userRepository.scope("withDeletedAt").findOne({ where: { id } });
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
