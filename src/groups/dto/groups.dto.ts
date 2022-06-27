import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import { UserEntityDto } from "../../users/dto/users.dto";
import { CourseEntityDto } from "../../courses/dto/courses.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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

  // @ApiProperty({ type: () => UserEntityDto, isArray: true })
  // students: User[];
  //
  // @ApiProperty({ type: () => CourseEntityDto, isArray: true })
  // assignedCourses: User[];
}
