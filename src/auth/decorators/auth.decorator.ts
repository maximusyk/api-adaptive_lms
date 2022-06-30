import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

export const AuthAccess = (roles?: string[]) => {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard('jwt-access'), RolesGuard),
    );
};

export const AuthRefresh = () => {
    return applyDecorators(
        UseGuards(AuthGuard('jwt-refresh')),
    );
};