import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { UserEntityDto } from '../../users/dto/users.dto';
import { CourseEntityDto } from '../../courses/dto/courses.dto';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GroupEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty({ type: () => UserEntityDto, isArray: true })
    students: User[];

    @ApiProperty({ type: () => CourseEntityDto, isArray: true })
    assignedCourses: User[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    // @ApiProperty({ type: () => UserEntityDto, isArray: true })
    // students: User[];
    //
    // @ApiProperty({ type: () => CourseEntityDto, isArray: true })
    // assignedCourses: User[];
}

export class UpdateGroupDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    title?: string;

    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    courseId?: string;

    @IsOptional()
    @IsUUID(4, { each: true })
    @ApiProperty({ required: false, isArray: true })
    studentIds?: string[];

    // @ApiProperty({ type: () => UserEntityDto, isArray: true })
    // students: User[];
    //
    // @ApiProperty({ type: () => CourseEntityDto, isArray: true })
    // assignedCourses: User[];
}

export class AssignCourseDto {
    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    courseId: string;
}