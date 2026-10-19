import * as dotenv from "dotenv"; dotenv.config();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: false });
  await app.listen(process.env.PORT ?? 4000);
  console.log(`dastafzar-api on :${process.env.PORT ?? 4000}`);
}
bootstrap();
