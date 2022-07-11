import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AssignCourseDto, CreateGroupDto, GroupEntityDto, UpdateGroupDto } from './dto/groups.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';
import { AuthAccess } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../roles/enums/role.enum';

@Controller('groups')
@ApiTags('Groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @ApiResponse(
        {
            status: 201,
            type: GroupEntityDto,
            description: 'Group successfully created'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN, RoleEnum.PROFESSOR ])
    @Post()
    create(@Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.create(createGroupDto);
    }

    @ApiResponse(
        {
            status: 201,
            type: GroupEntityDto,
            description: 'Group successfully created'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN, RoleEnum.PROFESSOR ])
    @Post('assign-course/:id')
    assignCourse(@Param() params: ParamsIdDto, @Body() assignCourseDto: AssignCourseDto) {
        return this.groupsService.assignCourse(params?.id, assignCourseDto);
    }

    @ApiResponse(
        {
            status: 200,
            type: GroupEntityDto,
            isArray: true,
            description: 'Get all groups'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get()
    findAll() {
        return this.groupsService.findAll();
    }

    @ApiResponse(
        {
            status: 200,
            type: GroupEntityDto,
            description: 'Get group by ID'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.groupsService.findOne(params?.id);
    }

    @ApiResponse(
        {
            status: 200,
            type: GroupEntityDto,
            description: 'Update group by ID'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN, RoleEnum.PROFESSOR ])
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateGroupDto: UpdateGroupDto) {
        return this.groupsService.update(params?.id, updateGroupDto);
    }

    @ApiResponse(
        {
            status: 200,
            description: 'Remove group by ID'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN, RoleEnum.PROFESSOR ])
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.groupsService.remove(params?.id);
    }
}
