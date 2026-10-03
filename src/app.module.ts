import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import configuration from "./config/configuration";
import { validateEnv } from "./config/env.validation";
import { AuthModule } from "./module/auth.module";
import { UserModule } from "./module/user.module";
import { TransactionModule } from "./module/transaction.module";
import { BookingModule } from "./module/booking.module";
import { DashboardModule } from "./module/dashboard.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>("throttle.ttl") ?? 60000,
          limit: config.get<number>("throttle.limit") ?? 100,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.getOrThrow("database.host"),
        port: config.get<number>("database.port") ?? 5432,
        username: config.getOrThrow("database.username"),
        password: config.getOrThrow("database.password"),
        database: config.getOrThrow("database.name"),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    AuthModule,
    UserModule,
    TransactionModule,
    BookingModule,
    DashboardModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
