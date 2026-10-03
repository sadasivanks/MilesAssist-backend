import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "../service/user.service";
import { UserQueryDto } from "../dto/user/user-query.dto";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { USER_ROUTES } from "../router/user.router";
@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(USER_ROUTES.BASE)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(USER_ROUTES.GET_USERS.path) getUsers(@Query() query: UserQueryDto) {
    return this.userService.getUsers(query);
  }
  @Get(USER_ROUTES.GET_USER_STATS.path) getUserStats() {
    return this.userService.getUserStats();
  }
  @Get(USER_ROUTES.GET_USER_BY_ID.path) getUserById(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.userService.getUserById(id);
  }
  @Post(USER_ROUTES.CREATE_USER.path) createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
  @Patch(USER_ROUTES.UPDATE_USER.path) updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, dto);
  }
  @Delete(USER_ROUTES.DELETE_USER.path) deleteUser(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.userService.deleteUser(id);
  }
}
