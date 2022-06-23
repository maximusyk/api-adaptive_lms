import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { CreateTokenDto, UpdateTokenDto } from "./dto/tokens.dto";

@Controller("tokens")
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokensService.create(createTokenDto);
  }

  @Get()
  findAll() {
    return this.tokensService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tokensService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTokenDto: UpdateTokenDto) {
    return this.tokensService.update(+id, updateTokenDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tokensService.remove(+id);
  }
}