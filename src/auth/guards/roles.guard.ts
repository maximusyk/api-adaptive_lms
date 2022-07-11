import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(
                'roles',
                [ context.getHandler(), context.getClass() ],
            );

            if ( !requiredRoles?.length ) {
                return true;
            }

            const { user } = context.switchToHttp().getRequest();

            return requiredRoles.includes(user.role);
        } catch ( e ) {
            throw new HttpException('Denied Access', HttpStatus.FORBIDDEN);
        }
    }
}
