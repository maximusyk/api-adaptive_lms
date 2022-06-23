import { PartialType } from '@nestjs/swagger';
import { CreateLectureReferenceDto } from './create-lecture-reference.dto';

export class UpdateLectureReferenceDto extends PartialType(CreateLectureReferenceDto) {}
