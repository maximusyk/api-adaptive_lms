import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUpdateTokenDto } from './dto/tokens.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './entities/token.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

const includeOptions = [
    {
        model: User,
        include: [
            { model: Role },
        ],
    },
];

@Injectable()
export class TokensService {
    constructor(
        @InjectModel(Token) private readonly tokenRepository: typeof Token,
    ) {}

    async createOrUpdate(userId: string, refreshToken: string) {
        try {
            const existedToken = await this.findOne(userId, true);
            if ( existedToken ) {
                return this.update(userId, refreshToken);
            }

            return this.create({ userId, refreshToken });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async create(createTokenDto: CreateUpdateTokenDto) {
        try {
            return this.tokenRepository.create(createTokenDto, { include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findAll() {
        try {
            return this.tokenRepository.findAll({ include: { all: true } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(userId: string, isOnlyCheck = false) {
        try {
            if ( isOnlyCheck ) return this.tokenRepository.findOne({ where: { userId } });

            const token = await this.tokenRepository.findOne({ where: { userId }, include: { all: true } });
            if ( !token ) throw new HttpException('Token not found!', HttpStatus.NOT_FOUND);

            await token.reload({ include: includeOptions });

            return token;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, refreshToken: string) {
        try {
            return this.tokenRepository.update({ refreshToken }, { where: { id } });
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string) {
        try {
            const token = await this.tokenRepository.findOne({ where: { id } });
            if ( !token ) {
                throw new HttpException('Token not found!', HttpStatus.NOT_FOUND);
            }

            await token.destroy();

            return { statusCode: HttpStatus.OK, message: 'Success!' };
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async removeByUser(userId: string) {
        try {
            if ( !userId ) throw new HttpException('User id is required!', HttpStatus.BAD_REQUEST);
            const token = await this.tokenRepository.findOne({ where: { userId } });
            if ( !token ) {
                throw new HttpException('User already logout!', HttpStatus.NOT_FOUND);
            }

            await token.destroy();

            return { statusCode: HttpStatus.OK, message: 'Success!' };
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }
}
