import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LectureReferencesService } from './lecture-references.service';
import { CreateLectureReferenceDto } from './dto/create-lecture-reference.dto';
import { UpdateLectureReferenceDto } from './dto/update-lecture-reference.dto';

@Controller('lecture-references')
export class LectureReferencesController {
  constructor(private readonly lectureReferencesService: LectureReferencesService) {}

  @Post()
  create(@Body() createLectureReferenceDto: CreateLectureReferenceDto) {
    return this.lectureReferencesService.create(createLectureReferenceDto);
  }

  @Get()
  findAll() {
    return this.lectureReferencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lectureReferencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLectureReferenceDto: UpdateLectureReferenceDto) {
    return this.lectureReferencesService.update(+id, updateLectureReferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lectureReferencesService.remove(+id);
  }
}
