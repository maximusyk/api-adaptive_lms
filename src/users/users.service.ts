import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { RoleEnum } from '../roles/enums/role.enum';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { GroupsService } from '../groups/groups.service';
import { RolesService } from '../roles/roles.service';
import { Op } from 'sequelize';
import { Role } from '../roles/entities/role.entity';
import { Group } from '../groups/entities/group.entity';
import * as bcrypt from 'bcrypt';

const includeOptions = [
    {
        model: Role,
    },
    {
        model: Group,
    },
];

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private readonly userRepository: typeof User,
        @Inject(forwardRef(() => GroupsService))
        private readonly groupsService: GroupsService,
        private readonly rolesService: RolesService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const isDeleted = await this.userRepository.scope('withDeletedAt').findOne({
                paranoid: false,
                where: { email: createUserDto.email },
            });

            if ( isDeleted && isDeleted?.deletedAt === null ) {
                throw new HttpException('User with this email already exists!', HttpStatus.BAD_REQUEST);
            }
            // TODO – check if user with this username already exists

            if ( createUserDto.groupId ) {
                await this.groupsService.findOne(createUserDto.groupId);
            }
            if ( createUserDto.roleId ) {
                await this.rolesService.findOne(createUserDto.roleId);
            }

            const hashedPassword = createUserDto.hashedPassword
                ? createUserDto.hashedPassword
                : await bcrypt.hash(createUserDto.password, 10);

            if ( isDeleted ) {
                await isDeleted.restore();
                const user = await isDeleted.update(createUserDto);
                await user.reload({ include: includeOptions });

                return user;
            } else {
                const newUser = await this.userRepository.create(
                    { ...createUserDto, password: hashedPassword },
                    { include: { all: true } },
                );
                await newUser.reload({ include: includeOptions });

                return newUser;
            }
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

    async findById(id: string) {
        try {
            const user = await this.userRepository.findByPk(id, { include: { all: true } });
            if ( !user ) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
            await user.reload({ include: includeOptions });
            return user;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findByLogin(search: string) {
        try {
            const user = await this.userRepository.findOne(
                {
                    where: {
                        [Op.or]: [
                            { email: { [Op.eq]: search } },
                            { username: { [Op.eq]: search } },
                        ],
                    },
                },
            );
            if ( !user ) throw new HttpException('User with given login does not exist!', HttpStatus.NOT_FOUND);

            await user.reload({ include: includeOptions });
            return user;
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
                throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);
            }

            if ( !role ) {
                throw new HttpException('role is required!', HttpStatus.BAD_REQUEST);
            }

            const user = await this.userRepository.findByPk(id, { include: { all: true } });

            if ( !user ) {
                throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
            }

            if ( user.role.title !== role ) {
                throw new HttpException('User does not have the required role!', HttpStatus.FORBIDDEN);
            }

            return true;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string) {
        try {
            if ( !id ) {
                throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);
            }
            const chapter = await this.userRepository.scope('withDeletedAt').findOne({ where: { id } });
            if ( !chapter ) {
                throw new HttpException('Chapter not found!', HttpStatus.NOT_FOUND);
            }

            await chapter.destroy();

            return { statusCode: HttpStatus.OK, message: 'Success!' };
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }
}
