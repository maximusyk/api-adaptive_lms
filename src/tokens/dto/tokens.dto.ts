import { ApiProperty } from '@nestjs/swagger';
import { UserEntityDto } from '../../users/dto/users.dto';
import { User } from '../../users/entities/user.entity';

export class TokenEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ type: () => UserEntityDto })
    user: User;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class CreateUpdateTokenDto {
    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    userId: string;
}