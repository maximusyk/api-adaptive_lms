import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateUpdateTokenDto, TokenEntityDto } from './dto/tokens.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';

@Controller('tokens')
@ApiTags('Tokens')
export class TokensController {
    constructor(private readonly tokensService: TokensService) {}

    @ApiResponse(
        {
            status: 200,
            type: TokenEntityDto,
            description: 'Token successfully created',
        },
    )
    @Post()
    create(@Body() createTokenDto: CreateUpdateTokenDto) {
        return this.tokensService.create(createTokenDto);
    }

    @ApiResponse(
        {
            status: 200,
            type: TokenEntityDto,
            isArray: true,
            description: 'Get all tokens',
        },
    )
    @Get()
    findAll() {
        return this.tokensService.findAll();
    }

    @ApiResponse(
        {
            status: 200,
            type: TokenEntityDto,
            description: 'Get token by ID',
        },
    )
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.tokensService.findOne(params?.id);
    }

    @ApiResponse(
        {
            status: 200,
            type: TokenEntityDto,
            description: 'Update token by ID',
        },
    )
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateTokenDto: CreateUpdateTokenDto) {
        return this.tokensService.update(params?.id, updateTokenDto.refreshToken);
    }

    @ApiResponse(
        {
            status: 200,
            description: 'Remove token by ID',
        },
    )
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.tokensService.remove(params?.id);
    }
}
