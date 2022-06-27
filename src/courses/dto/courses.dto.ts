import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import { UserEntityDto } from "../../users/dto/users.dto";
import { Chapter } from "../../chapters/entities/chapter.entity";
import { ChapterEntityDto } from "../../chapters/dto/chapters.dto";
import { Group } from "../../groups/entities/group.entity";
import { GroupEntityDto } from "../../groups/dto/groups.dto";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CourseEntityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  professorId: string;

  @ApiProperty({ type: () => UserEntityDto })
  professor: User;

  @ApiProperty({ type: () => [ ChapterEntityDto ] })
  chapters: Chapter[];

  @ApiProperty({ type: () => [ GroupEntityDto ] })
  assignedGroups: Group[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @IsUUID(4, { message: "Professor ID must be a valid UUID" })
  @ApiProperty()
  professorId?: string;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @IsUUID(4, { message: "Professor ID must be a valid UUID" })
  @ApiProperty({ required: false })
  professorId?: string;
}