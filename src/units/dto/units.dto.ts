import { ApiProperty } from '@nestjs/swagger';
import { CohesionRate } from '../entities/cohesion-rate.entity';
import { Lecture } from '../../lectures/entities/lecture.entity';
import { LectureEntityDto } from '../../lectures/dto/lectures.dto';
import { Unit } from '../entities/unit.entity';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UnitEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty({ type: () => [ UnitCohesionRateEntityDto ] })
    cohesionRates: CohesionRate[];

    @ApiProperty()
    lectureId: string;

    @ApiProperty({ type: () => LectureEntityDto })
    lecture: Lecture;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class UnitCohesionRateEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    unitId: string;

    @ApiProperty({ type: () => UnitEntityDto })
    unit: Unit;

    @ApiProperty()
    cohesionUnitId: string;

    @ApiProperty({ type: () => UnitEntityDto })
    cohesionUnit: Unit;

    @ApiProperty()
    cohesionRate: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class CreateUnitDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    content: string;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    lectureId: string;
}

export class CreateUnitCohesionRateDto {
    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    unitId?: string;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    cohesionUnitId: string;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    cohesionRate: number;
}

export class UpdateUnitDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    content?: string;

    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    lectureId?: string;

    @IsOptional()
    @ApiProperty({ type: () => [ CreateUnitCohesionRateDto ], required: false, isArray: true })
    cohesionUnits?: CreateUnitCohesionRateDto[];
}