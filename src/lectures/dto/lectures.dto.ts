import { ApiProperty } from '@nestjs/swagger';
import { ChapterEntityDto } from '../../chapters/dto/chapters.dto';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { UnitEntityDto } from '../../units/dto/units.dto';
import { Unit } from '../../units/entities/unit.entity';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsFile } from '../../is-file.decorator';

export class LectureEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    fileId: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    chapterId: string;

    @ApiProperty({ type: ChapterEntityDto })
    chapter: Chapter;

    @ApiProperty({ type: UnitEntityDto, isArray: true })
    units: Unit[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class CreateLectureDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsOptional()
    @IsFile({
        mime: [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
    })
    @ApiProperty({ required: false })
    lectureFile: Express.Multer.File;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    chapterId: string;
}

export class UpdateLectureDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    title?: string;

    // @IsOptional()
    // @IsUUID(4, { each: true })
    // @ApiProperty({ isArray: true, required: false })
    // units?: string[];
}
