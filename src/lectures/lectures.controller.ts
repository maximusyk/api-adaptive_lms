import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { LecturesService } from "./lectures.service";
import { CreateLectureDto, UpdateLectureDto } from "./dto/lectures.dto";

@Controller("lectures")
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Post()
  create(@Body() createLectureDto: CreateLectureDto) {
    return this.lecturesService.create(createLectureDto);
  }

  @Get()
  findAll() {
    return this.lecturesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.lecturesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateLectureDto: UpdateLectureDto) {
    return this.lecturesService.update(+id, updateLectureDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.lecturesService.remove(+id);
  }
}
