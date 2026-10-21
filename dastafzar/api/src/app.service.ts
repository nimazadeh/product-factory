import { Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "./prisma.service";

const TOOLS = [
  { slug: "jalali-calendar", title: "تقویم شمسی تعاملی" },
  { slug: "date-converter", title: "مبدل تاریخ" },
  { slug: "age-calculator", title: "محاسبه سن" },
  { slug: "date-difference", title: "فاصله دو تاریخ" },
  { slug: "nowruz-countdown", title: "شمارش معکوس نوروز" },
  { slug: "invoice-maker", title: "فاکتورساز حرفه‌ای" },
];

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private db: PrismaService, private jwt: JwtService) {}

  async onModuleInit() {
    // seed admin (from env) + default tool settings + occasions
    const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
    if (!(await this.db.adminUser.findUnique({ where: { email } }))) {
      await this.db.adminUser.create({ data: { email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "admin12345", 10) } });
    }
    for (const t of TOOLS) await this.db.toolSetting.upsert({ where: { slug: t.slug }, update: {}, create: t });
    const defaults = [
      { title: "نوروز", month: 1, day: 1 }, { title: "مهرگان", month: 7, day: 16 }, { title: "یلدا", month: 9, day: 30 },
    ];
    if ((await this.db.occasion.count()) === 0) await this.db.occasion.createMany({ data: defaults });
  }

  async login(email: string, password: string) {
    const admin = await this.db.adminUser.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) throw new UnauthorizedException("ایمیل یا رمز نادرست است");
    return { token: await this.jwt.signAsync({ sub: admin.id, email }), email };
  }

  async stats() {
    const since30 = new Date(Date.now() - 30 * 86_400_000);
    const [totalEvents, last30, byTool, recent, occasions, tools, feedbackOpen] = await Promise.all([
      this.db.toolEvent.count(),
      this.db.toolEvent.count({ where: { createdAt: { gte: since30 } } }),
      this.db.toolEvent.groupBy({ by: ["tool"], _count: true, orderBy: { _count: { tool: "desc" } } }),
      this.db.toolEvent.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
      this.db.occasion.findMany({ orderBy: [{ month: "asc" }, { day: "asc" }] }),
      this.db.toolSetting.findMany(),
      this.db.feedback.count({ where: { handled: false } }),
    ]);
    const daily: Record<string, number> = {};
    (await this.db.toolEvent.findMany({ where: { createdAt: { gte: since30 } }, select: { createdAt: true } }))
      .forEach((e) => { const k = e.createdAt.toISOString().slice(0, 10); daily[k] = (daily[k] ?? 0) + 1; });
    return { totalEvents, last30, byTool: byTool.map((t) => ({ tool: t.tool, count: t._count })), daily, recent, occasions, tools, feedbackOpen };
  }
}
