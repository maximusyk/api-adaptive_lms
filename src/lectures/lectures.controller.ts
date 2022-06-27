import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { LecturesService } from "./lectures.service";
import { CreateLectureDto, LectureEntityDto, UpdateLectureDto } from "./dto/lectures.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ParamsIdDto } from "../dto/main.dto";

@Controller("lectures")
@ApiTags("Lectures")
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @ApiResponse(
    {
      status: 201,
      type: LectureEntityDto,
      description: "Lecture successfully created"
    }
  )
  @Post()
  create(@Body() createLectureDto: CreateLectureDto) {
    return this.lecturesService.create(createLectureDto);
  }

  @ApiResponse(
    {
      status: 200,
      type: LectureEntityDto,
      isArray: true,
      description: "Get all lectures"
    }
  )
  @Get()
  findAll() {
    return this.lecturesService.findAll();
  }

  @ApiResponse(
    {
      status: 200,
      type: LectureEntityDto,
      description: "Get lecture by ID"
    }
  )
  @Get(":id")
  findOne(@Param() params: ParamsIdDto) {
    return this.lecturesService.findOne(params?.id);
  }

  @ApiResponse(
    {
      status: 200,
      type: LectureEntityDto,
      description: "Update lecture by ID"
    }
  )
  @Patch(":id")
  update(@Param() params: ParamsIdDto, @Body() updateLectureDto: UpdateLectureDto) {
    return this.lecturesService.update(params?.id, updateLectureDto);
  }

  @ApiResponse(
    {
      status: 200,
      description: "Remove lecture by ID"
    }
  )
  @Delete(":id")
  remove(@Param() params: ParamsIdDto) {
    return this.lecturesService.remove(params?.id);
  }
}
