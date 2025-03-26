import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtPayloadType } from 'src/utils/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access denied, no token provided');
    }

    try {
      const payload: JwtPayloadType = await this.jwtService.verifyAsync(token);


      const user = await this.userService.getSpecialUser(payload.id);


      if (this.hasUserChangedPassword(user.data.changePasswordDate, payload.iat)) {
        throw new UnauthorizedException('User changed password, please login again');
      }

      request['user'] = payload; 
    } catch (error) {
      console.error(error);
      if (error instanceof UnauthorizedException) {
        throw error; 
      }
      if(error instanceof NotFoundException){
        throw new NotFoundException('The user belonging to this token does not exist anymore.');
      }
  
      throw new UnauthorizedException('Access denied, invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined; // تجنب الأخطاء

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private hasUserChangedPassword(changePasswordDate: Date | null, tokenIssuedAt: number): boolean {
    if (!changePasswordDate) return false; // لا حاجة للتحقق إذا لم يتم تغيير كلمة المرور

    const passwordChangedTimestamp = Math.floor(changePasswordDate.getTime() / 1000);
    return passwordChangedTimestamp > tokenIssuedAt;
  }
}
