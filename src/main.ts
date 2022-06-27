import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function start() {
  const PORT = process.env.APP_PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
  .setTitle("Coursuch API")
  .setVersion("1.0")
  .addServer("http://localhost:" + configService.get("APP_PORT"), "Coursuch Local")
  .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("/api/docs", app, document);

  fs.writeFileSync("swagger.json", JSON.stringify(document), { encoding: "utf8" });

  await app.listen(PORT, () => console.log(`Server running on port ${ PORT }`));
}

start();