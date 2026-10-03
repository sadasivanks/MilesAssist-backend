import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Admin, AdminStatus } from "../entity/admin.entity";
import { LoginDto } from "../dto/auth/login.dto";
import { success } from "../common/utils/response";
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}
  async loginAdmin(dto: LoginDto) {
    const admin = await this.adminRepository
      .createQueryBuilder("admin")
      .addSelect("admin.passwordHash")
      .where("LOWER(admin.email) = LOWER(:email)", { email: dto.email })
      .getOne();
    if (
      !admin ||
      admin.status !== AdminStatus.ACTIVE ||
      !(await bcrypt.compare(dto.password, admin.passwordHash))
    )
      throw new UnauthorizedException("Invalid email or password");
    const accessToken = await this.jwtService.signAsync({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });
    return success({
      accessToken,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  }
  getAdminProfile(admin: any) {
    return success(admin);
  }
}
