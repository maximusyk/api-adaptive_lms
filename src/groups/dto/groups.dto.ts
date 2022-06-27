import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import { UserEntityDto } from "../../users/dto/users.dto";
import { CourseEntityDto } from "../../courses/dto/courses.dto";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class GroupEntityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  curatorId: string;

  @ApiProperty({ type: () => UserEntityDto })
  curator: User;

  @ApiProperty()
  leaderId: string;

  @ApiProperty({ type: () => UserEntityDto })
  leader: User;

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

  @IsOptional()
  @IsUUID(4)
  @ApiProperty({ required: false })
  curatorId?: string;

  @IsOptional()
  @IsUUID(4)
  @ApiProperty({ required: false })
  leaderId?: string;

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
  curatorId?: string;

  @IsOptional()
  @IsUUID(4)
  @ApiProperty({ required: false })
  leaderId?: string;

  // @ApiProperty({ type: () => UserEntityDto, isArray: true })
  // students: User[];
  //
  // @ApiProperty({ type: () => CourseEntityDto, isArray: true })
  // assignedCourses: User[];
}
