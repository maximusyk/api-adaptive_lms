import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { KeywordsService } from "./keywords.service";
import { CreateKeywordDto } from "./dto/create-keyword.dto";
import { UpdateKeywordDto } from "./dto/update-keyword.dto";
import { ParamsIdDto } from "../dto/main.dto";

@Controller("keywords")
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post()
  create(@Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordsService.create(createKeywordDto);
  }

  @Get()
  findAll() {
    return this.keywordsService.findAll();
  }

  @Get(":id")
  findOne(@Param() params: ParamsIdDto) {
    return this.keywordsService.findOne(params?.id);
  }

  @Patch(":id")
  update(@Param() params: ParamsIdDto, @Body() updateKeywordDto: UpdateKeywordDto) {
    return this.keywordsService.update(params?.id, updateKeywordDto);
  }

  @Delete(":id")
  remove(@Param() params: ParamsIdDto) {
    return this.keywordsService.remove(params?.id);
  }
}
