import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { EventDto, FeedbackDto, LoginDto, OccasionDto, ToolToggleDto } from "./dto";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { JwtGuard } from "./auth";

@Controller()
export class AppController {
  constructor(private app: AppService, private db: PrismaService) {}

  @Get("health") health() { return { ok: true, service: "dastafzar-api" }; }

  // —— public ——
  @Post("events") async event(@Body() b: EventDto) {
    await this.db.toolEvent.create({ data: { tool: b.tool, action: b.action } });
    return { ok: true };
  }
  @Post("feedback") async feedback(@Body() b: FeedbackDto) {
    await this.db.feedback.create({ data: { name: b.name, contact: b.contact, message: b.message } });
    return { ok: true };
  }
  @Get("public/occasions") occasions() { return this.db.occasion.findMany({ where: { enabled: true }, orderBy: [{ month: "asc" }, { day: "asc" }] }); }
  @Get("public/tools") tools() { return this.db.toolSetting.findMany(); }

  // —— auth ——
  @Throttle({ default: { limit: 5, ttl: 60000 } }) @Post("auth/login") login(@Body() b: LoginDto) { return this.app.login(b.email, b.password); }

  // —— admin (JWT) ——
  @UseGuards(JwtGuard) @Get("admin/stats") stats() { return this.app.stats(); }
  @UseGuards(JwtGuard) @Get("admin/feedback") feedbackList() { return this.db.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 50 }); }
  @UseGuards(JwtGuard) @Patch("admin/feedback/:id") async fbHandled(@Param("id") id: string) {
    return this.db.feedback.update({ where: { id }, data: { handled: true } });
  }
  @UseGuards(JwtGuard) @Post("admin/occasions") addOccasion(@Body() b: OccasionDto) {
    return this.db.occasion.create({ data: { title: b.title, month: +b.month, day: +b.day } });
  }
  @UseGuards(JwtGuard) @Delete("admin/occasions/:id") delOccasion(@Param("id") id: string) {
    return this.db.occasion.delete({ where: { id } });
  }
  @UseGuards(JwtGuard) @Patch("admin/tools/:slug") async toggleTool(@Param("slug") slug: string, @Body() b: ToolToggleDto) {
    return this.db.toolSetting.update({ where: { slug }, data: { enabled: !!b.enabled } });
  }
}
