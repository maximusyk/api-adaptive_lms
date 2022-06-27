import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { CreateGroupDto, GroupEntityDto, UpdateGroupDto } from "./dto/groups.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ParamsIdDto } from "../dto/main.dto";

@Controller("groups")
@ApiTags("Groups")
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiResponse(
    {
      status: 201,
      type: GroupEntityDto,
      description: "Group successfully created"
    }
  )
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @ApiResponse(
    {
      status: 200,
      type: GroupEntityDto,
      isArray: true,
      description: "Get all groups"
    }
  )
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @ApiResponse(
    {
      status: 200,
      type: GroupEntityDto,
      description: "Get group by ID"
    }
  )
  @Get(":id")
  findOne(@Param() params: ParamsIdDto) {
    return this.groupsService.findOne(params?.id);
  }

  @ApiResponse(
    {
      status: 200,
      type: GroupEntityDto,
      description: "Update group by ID"
    }
  )
  @Patch(":id")
  update(@Param() params: ParamsIdDto, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(params?.id, updateGroupDto);
  }

  @ApiResponse(
    {
      status: 200,
      description: "Remove group by ID"
    }
  )
  @Delete(":id")
  remove(@Param() params: ParamsIdDto) {
    return this.groupsService.remove(params?.id);
  }
}
