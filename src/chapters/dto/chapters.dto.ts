import { ApiProperty } from '@nestjs/swagger';
import { Lecture } from '../../lectures/entities/lecture.entity';
import { LectureEntityDto } from '../../lectures/dto/lectures.dto';
import { QuizEntityDto } from '../../quizzes/dto/quizzes.dto';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { CourseEntityDto } from '../../courses/dto/courses.dto';
import { Course } from '../../courses/entities/course.entity';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ChapterEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty({ type: () => [LectureEntityDto] })
    lectures: Lecture[];

    @ApiProperty({ type: () => [QuizEntityDto] })
    quizzes: Quiz[];

    @ApiProperty()
    courseId: string;

    @ApiProperty({ type: () => [CourseEntityDto] })
    course: Course;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class CreateChapterDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    courseId: string;
}

export class UpdateChapterDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    title?: string;

    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    courseId?: string;
}

export class CheckChapterUniqueDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    courseId: string;
}