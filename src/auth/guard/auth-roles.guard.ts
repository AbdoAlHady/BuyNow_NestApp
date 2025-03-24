import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { JwtPayloadType } from "src/utils/types";
import { Roles } from "../decorators/roles.decorator";



@Injectable()
export class AuthRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(Roles, context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request:Request = context.switchToHttp().getRequest();
    const user:JwtPayloadType = request['user'] as JwtPayloadType;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied,you are not allowed to access this resource');
    }

    return true;
    }
}