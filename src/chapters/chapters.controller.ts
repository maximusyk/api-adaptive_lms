import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ChaptersService } from "./chapters.service";
import { CreateChapterDto, UpdateChapterDto } from "./dto/chapters.dto";

@Controller("chapters")
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @Get()
  findAll() {
    return this.chaptersService.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.chaptersService.findById(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(+id, updateChapterDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.chaptersService.remove(+id);
  }
}
