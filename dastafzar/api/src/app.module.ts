import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { JwtGuard } from "./auth";

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]), JwtModule.register({ secret: process.env.JWT_SECRET ?? "dev-secret", signOptions: { expiresIn: "7d" } })],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtGuard, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
