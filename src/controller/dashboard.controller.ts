import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DashboardService } from "../service/dashboard.service";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { DASHBOARD_ROUTES } from "../router/dashboard.router";
import { ChartQueryDto } from "../dto/dashboard/chart-query.dto";
@ApiTags("Dashboard")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(DASHBOARD_ROUTES.BASE)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get(DASHBOARD_ROUTES.GET_DASHBOARD_STATS.path) getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }
  @Get(DASHBOARD_ROUTES.GET_REVENUE_CHART.path) getRevenueChart(
    @Query() query: ChartQueryDto,
  ) {
    return this.dashboardService.getRevenueChart(query.range);
  }
  @Get(DASHBOARD_ROUTES.GET_DASHBOARD_ALERTS.path) getDashboardAlerts() {
    return this.dashboardService.getDashboardAlerts();
  }
}
