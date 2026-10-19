import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const token = (req.headers.authorization ?? "").replace("Bearer ", "");
    if (!token) throw new UnauthorizedException("توکن لازم است");
    try { req.admin = await this.jwt.verifyAsync(token); return true; }
    catch { throw new UnauthorizedException("توکن نامعتبر است"); }
  }
}
