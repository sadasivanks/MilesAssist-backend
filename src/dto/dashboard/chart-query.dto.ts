import { IsEnum, IsOptional } from 'class-validator'; export enum DashboardRange { DAYS_7='7D', MONTH_1='1M', MONTH_3='3M', MONTH_6='6M', YEAR_1='1Y' }
export class ChartQueryDto { @IsOptional() @IsEnum(DashboardRange) range: DashboardRange = DashboardRange.MONTH_6; }
