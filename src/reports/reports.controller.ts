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
  UseInterceptors,
} from '@nestjs/common';
// import fichier dto si il y a //
import { updateReportDto } from '../dto/update-report.dto';
// import fichier decorateur si il y a //
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { SerializeInterceptor } from 'src/interceptors/serializeInterceptor';

@Controller('report')
@UseInterceptors(SerializeInterceptor)
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
  createReport(@Body() body: Report) {
    return this.reportService.create(
      body.price,
      body.make,
      body.model,
      body.year,
      body.lat,
      body.lng,
      body.mileage,
    );
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
