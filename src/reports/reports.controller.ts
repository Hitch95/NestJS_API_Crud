import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { updateReportDto } from '../dto/update-report.dto';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { SerializeInterceptor } from 'src/interceptors/serializeInterceptor';
import { AuthGuard } from 'src/users/guards/auth.guards';
import { CreateReportDto } from 'src/dto/create-report-dto';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}
  @Get()
  findReportByModel(@Query('model') model: string) {
    const report = this.reportService.find(model);
    return report;
  }

  @Get('/:id')
  @UseInterceptors(SerializeInterceptor)
  async findById(@Param('id') id: number) {
    const report = await this.reportService.findOne(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    this.reportService.create(body, user);
  }

  @Patch(':id')
  async updateReport(
    @Param('id') id: string,
    @Body() updateReportDto: updateReportDto,
  ) {
    const reportId = parseInt(id);
    await this.reportService.update(reportId, updateReportDto);
    return { message: 'Report updated successfully' };
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(parseInt(id));
  }
}
