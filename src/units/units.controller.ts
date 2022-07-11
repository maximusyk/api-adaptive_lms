import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto, UnitEntityDto, UpdateUnitDto } from './dto/units.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';
import { AuthAccess } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../roles/enums/role.enum';

@Controller('units')
@ApiTags('Units')
export class UnitsController {
    constructor(private readonly unitsService: UnitsService) {}

    @ApiResponse(
        {
            status: 200,
            type: UnitEntityDto,
            description: 'Unit successfully created',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Post()
    create(@Body() createUnitDto: CreateUnitDto) {
        return this.unitsService.create(createUnitDto);
    }

    @ApiResponse(
        {
            status: 200,
            type: UnitEntityDto,
            isArray: true,
            description: 'Get all units',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Get()
    findAll() {
        return this.unitsService.findAll();
    }

    @ApiResponse(
        {
            status: 200,
            type: UnitEntityDto,
            description: 'Get unit by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.unitsService.findOne(params?.id);
    }

    @ApiResponse(
        {
            status: 200,
            type: UnitEntityDto,
            description: 'Get unit by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Get(':id')
    findByLectureId(@Param() params: ParamsIdDto) {
        return this.unitsService.findByLectureId(params?.id);
    }

    @ApiResponse(
        {
            status: 200,
            type: UnitEntityDto,
            description: 'Update unit by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateUnitDto: UpdateUnitDto) {
        return this.unitsService.update(params?.id, updateUnitDto);
    }

    @ApiResponse(
        {
            status: 200,
            description: 'Remove unit by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.unitsService.remove(params?.id);
    }
}
