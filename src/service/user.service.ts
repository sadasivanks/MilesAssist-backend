import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import { User, UserStatus } from "../entity/user.entity";
import { UserQueryDto } from "../dto/user/user-query.dto";
import { success } from "../common/utils/response";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getUsers(query: UserQueryDto) {
    const allowed: Record<string, string> = {
      name: "user.name",
      email: "user.email",
      status: "user.status",
      createdAt: "user.createdAt",
      lastActiveAt: "user.lastActiveAt",
    };
    const qb = this.userRepository
      .createQueryBuilder("user")
      .select([
        "user.id",
        "user.name",
        "user.email",
        "user.phone",
        "user.role",
        "user.status",
        "user.lastActiveAt",
        "user.createdAt",
        "user.updatedAt",
      ]);
    if (query.search)
      qb.andWhere(
        "(user.name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)",
        { search: `%${query.search}%` },
      );
    if (query.status)
      qb.andWhere("user.status = :status", { status: query.status });
    if (query.dateFrom)
      qb.andWhere("user.createdAt >= :dateFrom", { dateFrom: query.dateFrom });
    if (query.dateTo)
      qb.andWhere("user.createdAt <= :dateTo", { dateTo: query.dateTo });
    qb.orderBy(
      allowed[query.sortBy ?? "createdAt"] ?? allowed.createdAt,
      query.sortOrder,
    );
    const [users, total] = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();
    return success(users, {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    });
  }
  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    return success(user);
  }
  async createUser(dto: CreateUserDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException("Email already exists");
    return success(
      await this.userRepository.save(this.userRepository.create(dto)),
    );
  }
  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) throw new ConflictException("Email already exists");
    }
    Object.assign(user, dto);
    return success(await this.userRepository.save(user));
  }
  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    await this.userRepository.softRemove(user);
    return success({ message: "User deactivated" });
  }
  async getUserStats() {
    const row = await this.userRepository
      .createQueryBuilder("user")
      .select("COUNT(*)", "totalUsers")
      .addSelect(
        `COUNT(*) FILTER (WHERE user.status = 'ACTIVE')`,
        "activeUsers",
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE user.createdAt >= DATE_TRUNC('month', CURRENT_DATE))`,
        "newThisMonth",
      )
      .getRawOne();
    return success({
      totalUsers: Number(row.totalUsers),
      activeUsers: Number(row.activeUsers),
      newThisMonth: Number(row.newThisMonth),
    });
  }
}
