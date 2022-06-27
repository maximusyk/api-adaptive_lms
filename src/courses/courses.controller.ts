import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CourseEntityDto, CreateCourseDto, UpdateCourseDto } from "./dto/courses.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ParamsIdDto } from "../dto/main.dto";

@Controller("courses")
@ApiTags("Courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiResponse(
    {
      status: 200,
      type: CourseEntityDto,
      description: "Course successfully created"
    }
  )
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @ApiResponse(
    {
      status: 200,
      type: CourseEntityDto,
      isArray: true,
      description: "Get all courses"
    }
  )
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @ApiResponse(
    {
      status: 200,
      type: CourseEntityDto,
      description: "Get course by ID"
    }
  )
  @Get(":id")
  findOne(@Param() params: ParamsIdDto) {
    return this.coursesService.findOne(params?.id);
  }

  @ApiResponse(
    {
      status: 200,
      type: CourseEntityDto,
      description: "Update course by ID"
    }
  )
  @Patch(":id")
  update(@Param() params: ParamsIdDto, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(params?.id, updateCourseDto);
  }

  @ApiResponse(
    {
      status: 200,
      description: "Remove course by ID"
    }
  )
  @Delete(":id")
  remove(@Param() params: ParamsIdDto) {
    return this.coursesService.remove(params?.id);
  }
}
