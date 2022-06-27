import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ChaptersService } from "./chapters.service";
import { ChapterEntityDto, CreateChapterDto, UpdateChapterDto } from "./dto/chapters.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ParamsIdDto } from "../dto/main.dto";

@Controller("chapters")
@ApiTags("Chapters")
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @ApiResponse(
    {
      status: 201,
      type: ChapterEntityDto,
      description: "Chapter successfully created"
    }
  )
  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @ApiResponse(
    {
      status: 200,
      type: ChapterEntityDto,
      isArray: true,
      description: "Get all chapters"
    }
  )
  @Get()
  findAll() {
    return this.chaptersService.findAll();
  }

  @ApiResponse(
    {
      status: 200,
      type: ChapterEntityDto,
      description: "Get chapter by ID"
    }
  )
  @Get(":id")
  findById(@Param() params: ParamsIdDto) {
    return this.chaptersService.findById(params?.id);
  }

  @ApiResponse(
    {
      status: 200,
      type: ChapterEntityDto,
      description: "Update chapter by ID"
    }
  )
  @Patch(":id")
  update(@Param() params: ParamsIdDto, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(params?.id, updateChapterDto);
  }

  @ApiResponse(
    {
      status: 200,
      description: "Remove chapter by ID"
    }
  )
  @Delete(":id")
  remove(@Param() params: ParamsIdDto) {
    return this.chaptersService.remove(params?.id);
  }
}
