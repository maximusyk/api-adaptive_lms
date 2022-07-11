import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, RoleEntityDto, UpdateRoleDto } from './dto/roles.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';
import { AuthAccess } from '../auth/decorators/auth.decorator';
import { RoleEnum } from './enums/role.enum';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @ApiResponse(
        {
            status: 200,
            type: RoleEntityDto,
            description: 'Role successfully created',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN ])
    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @ApiResponse(
        {
            status: 200,
            type: RoleEntityDto,
            isArray: true,
            description: 'Get all roles',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN ])
    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @ApiResponse(
        {
            status: 200,
            type: RoleEntityDto,
            description: 'Get role by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN ])
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.rolesService.findOne(params?.id);
    }

    @ApiResponse(
        {
            status: 200,
            type: RoleEntityDto,
            description: 'Update role by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN ])
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(params?.id, updateRoleDto);
    }

    @ApiResponse(
        {
            status: 200,
            description: 'Remove role by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([ RoleEnum.ADMIN ])
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.rolesService.remove(params?.id);
    }
}
