import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../service/auth.service";
import { LoginDto } from "../dto/auth/login.dto";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { CurrentAdmin } from "../common/decorators/current-admin.decorator";
import { AUTH_ROUTES } from "../router/auth.router";
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post(AUTH_ROUTES.LOGIN_ADMIN.path)
  @ApiOperation({ summary: "Admin login with email and password" })
  loginAdmin(@Body() dto: LoginDto) {
    return this.authService.loginAdmin(dto);
  }
  @Get(AUTH_ROUTES.GET_MY_PROFILE.path)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current logged-in admin profile" })
  getMyProfile(@CurrentAdmin() admin: any) {
    return this.authService.getAdminProfile(admin);
  }
}
