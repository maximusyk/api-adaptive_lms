import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AssignCourseDto, CreateGroupDto, UpdateGroupDto } from './dto/groups.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './entities/group.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group) private readonly groupRepository: typeof Group,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) {}

    async create(createGroupDto: CreateGroupDto) {
        try {
            return this.groupRepository.create(createGroupDto, { include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findAll() {
        try {
            return this.groupRepository.findAll({ include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string) {
        try {
            if ( !id ) throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);

            const group = await this.groupRepository.findByPk(id, { include: { all: true } });

            if ( !group ) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

            return group;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateGroupDto: UpdateGroupDto) {
        try {
            if ( !id ) throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);

            const group = await this.findOne(id);

            const updatedGroup = await group.update(updateGroupDto);
            await updatedGroup.reload({ include: { all: true } });

            return updatedGroup;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async assignCourse(id: string, assignCourseDto: AssignCourseDto) {
        try {
            return this.update(id, assignCourseDto);
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string) {
        try {
            if ( !id ) {
                throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);
            }
            const group = await this.groupRepository.scope('withDeletedAt').findOne({ where: { id } });
            if ( !group ) {
                throw new HttpException('Chapter not found!', HttpStatus.NOT_FOUND);
            }

            await group.destroy();

            return { statusCode: HttpStatus.OK, message: 'Success!' };
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }
}
