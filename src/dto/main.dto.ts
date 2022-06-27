import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class ParamsIdDto {
  @IsUUID(4, { message: "Invalid UUID" })
  @ApiProperty()
  id: string;
}