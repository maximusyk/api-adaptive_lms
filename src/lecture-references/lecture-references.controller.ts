import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { LectureReferencesService } from "./lecture-references.service";
import { CreateLectureReferenceDto } from "./dto/create-lecture-reference.dto";
import { UpdateLectureReferenceDto } from "./dto/update-lecture-reference.dto";
import { ParamsIdDto } from "../dto/main.dto";

@Controller("lecture-references")
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

  @Get(":id")
  findOne(@Param() params: ParamsIdDto) {
    return this.lectureReferencesService.findOne(params?.id);
  }

  @Patch(":id")
  update(@Param() params: ParamsIdDto, @Body() updateLectureReferenceDto: UpdateLectureReferenceDto) {
    return this.lectureReferencesService.update(params?.id, updateLectureReferenceDto);
  }

  @Delete(":id")
  remove(@Param() params: ParamsIdDto) {
    return this.lectureReferencesService.remove(params?.id);
  }
}
