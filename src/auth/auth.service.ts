import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/users.dto';
import { AuthTokensDto, SigninLocalDto } from './dto/auth.dto';
import { RoleEnum } from '../roles/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly tokensService: TokensService,
    ) {}

    hashData(data: string) {
        try {
            return bcrypt.hash(data, 10);
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async signTokens(userId: string, email: string, role: RoleEnum): Promise<AuthTokensDto> {
        try {
            const [ accessToken, refreshToken ] = await Promise.all([
                this.jwtService.signAsync(
                    { sub: userId, email, role },
                    { secret: process.env.JWT_SECRET_ACCESS_KEY, expiresIn: '5m' },
                ),
                this.jwtService.signAsync(
                    { sub: userId, email, role },
                    { secret: process.env.JWT_SECRET_REFRESH_KEY, expiresIn: '1w' },
                ),
            ]);

            return { accessToken, refreshToken };
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async signupLocal(signupData: CreateUserDto): Promise<AuthTokensDto> {
        try {
            const hashedPassword = await this.hashData(signupData.password);

            const user = await this.usersService.create({ ...signupData, hashedPassword });

            const signedTokens = await this.signTokens(user.id, user.email, user.role.title);

            await this.tokensService.createOrUpdate(user.id, await this.hashData(signedTokens.refreshToken));

            return signedTokens;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async signinLocal(signinData: SigninLocalDto): Promise<AuthTokensDto> {
        try {
            const user = await this.usersService.findByLogin(signinData.email);
            if ( !user ) throw new HttpException('User with this email does not exist!', HttpStatus.BAD_REQUEST);

            const isPasswordMatches = await bcrypt.compare(signinData.password, user.password);
            if ( !isPasswordMatches ) throw new HttpException('Password is incorrect!', HttpStatus.BAD_REQUEST);

            const signedTokens = await this.signTokens(user.id, user.email, user.role.title);

            await this.tokensService.createOrUpdate(user.id, await this.hashData(signedTokens.refreshToken));

            return signedTokens;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async logout(userId: string): Promise<void> {
        try {
            await this.tokensService.removeByUser(userId);
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async refreshTokens(userId: string, refreshToken: string) {
        try {
            const token = await this.tokensService.findOne(userId);
            if ( !token ) throw new HttpException('User token not found!', HttpStatus.BAD_REQUEST);

            const isRefreshTokenMatches = await bcrypt.compare(refreshToken, token.refreshToken);
            if ( !isRefreshTokenMatches ) throw new HttpException(
                'Refresh token is incorrect!',
                HttpStatus.BAD_REQUEST,
            );

            const signedTokens = await this.signTokens(token.user.id, token.user.email, token.user.role.title);

            await this.tokensService.createOrUpdate(token.user.id, await this.hashData(signedTokens.refreshToken));

            return signedTokens;
        } catch ( error ) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }
}
