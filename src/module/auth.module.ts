import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Admin } from "../entity/admin.entity";
import { AuthService } from "../service/auth.service";
import { AuthController } from "../controller/auth.controller";
import { JwtStrategy } from "../strategy/jwt.strategy";
@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow("jwt.secret"),
        signOptions: {
          expiresIn: (config.get<string>("jwt.expiresIn") ?? "1d") as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
