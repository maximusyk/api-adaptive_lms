import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserEntityDto } from './dto/users.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiResponse(
        {
            status: 201,
            type: UserEntityDto,
            description: 'User successfully created',
        },
    )
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @ApiResponse(
        {
            status: 200,
            type: UserEntityDto,
            isArray: true,
            description: 'Get all users',
        },
    )
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @ApiResponse(
        {
            status: 200,
            type: UserEntityDto,
            description: 'Get user by ID',
        },
    )
    @Get(':id')
    findById(@Param() params: ParamsIdDto) {
        return this.usersService.findById(params?.id);
    }

    @ApiResponse(
        {
            status: 200,
            type: UserEntityDto,
            description: 'Update user by ID',
        },
    )
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(params?.id, updateUserDto);
    }

    @ApiResponse(
        {
            status: 200,
            description: 'Remove user by ID',
        },
    )
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.usersService.remove(params?.id);
    }
}
