import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseEntityDto, CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';
import { AuthAccess } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../roles/enums/role.enum';

@Controller('courses')
@ApiTags('Courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @ApiResponse(
        {
            status: 200,
            type: CourseEntityDto,
            description: 'Course successfully created',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN, RoleEnum.PROFESSOR ])
    @Post()
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.create(createCourseDto);
    }

    @ApiResponse(
        {
            status: 200,
            type: CourseEntityDto,
            isArray: true,
            description: 'Get all courses',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    @ApiResponse(
        {
            status: 200,
            type: CourseEntityDto,
            description: 'Get course by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.coursesService.findOne(params?.id);
    }

    @ApiResponse(
        {
            status: 200,
            type: CourseEntityDto,
            description: 'Update course by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN, RoleEnum.PROFESSOR ])
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.update(params?.id, updateCourseDto);
    }

    @ApiResponse(
        {
            status: 200,
            description: 'Remove course by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN, RoleEnum.PROFESSOR ])
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.coursesService.remove(params?.id);
    }
}
