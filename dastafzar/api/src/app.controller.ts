import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { JwtGuard } from "./auth";

@Controller()
export class AppController {
  constructor(private app: AppService, private db: PrismaService) {}

  @Get("health") health() { return { ok: true, service: "dastafzar-api" }; }

  // —— public ——
  @Post("events") async event(@Body() b: { tool: string; action: string }) {
    if (!b?.tool || !b?.action) return { ok: false };
    await this.db.toolEvent.create({ data: { tool: b.tool.slice(0, 40), action: b.action.slice(0, 20) } });
    return { ok: true };
  }
  @Post("feedback") async feedback(@Body() b: { name?: string; contact?: string; message: string }) {
    if (!b?.message?.trim()) return { ok: false };
    await this.db.feedback.create({ data: { name: b.name, contact: b.contact, message: b.message.slice(0, 2000) } });
    return { ok: true };
  }
  @Get("public/occasions") occasions() { return this.db.occasion.findMany({ where: { enabled: true }, orderBy: [{ month: "asc" }, { day: "asc" }] }); }
  @Get("public/tools") tools() { return this.db.toolSetting.findMany(); }

  // —— auth ——
  @Post("auth/login") login(@Body() b: { email: string; password: string }) { return this.app.login(b.email, b.password); }

  // —— admin (JWT) ——
  @UseGuards(JwtGuard) @Get("admin/stats") stats() { return this.app.stats(); }
  @UseGuards(JwtGuard) @Get("admin/feedback") feedbackList() { return this.db.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 50 }); }
  @UseGuards(JwtGuard) @Patch("admin/feedback/:id") async fbHandled(@Param("id") id: string) {
    return this.db.feedback.update({ where: { id }, data: { handled: true } });
  }
  @UseGuards(JwtGuard) @Post("admin/occasions") addOccasion(@Body() b: { title: string; month: number; day: number }) {
    return this.db.occasion.create({ data: { title: b.title, month: +b.month, day: +b.day } });
  }
  @UseGuards(JwtGuard) @Delete("admin/occasions/:id") delOccasion(@Param("id") id: string) {
    return this.db.occasion.delete({ where: { id } });
  }
  @UseGuards(JwtGuard) @Patch("admin/tools/:slug") async toggleTool(@Param("slug") slug: string, @Body() b: { enabled: boolean }) {
    return this.db.toolSetting.update({ where: { slug }, data: { enabled: !!b.enabled } });
  }
}
