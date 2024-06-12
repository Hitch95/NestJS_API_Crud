import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(
    price: number,
    make: string,
    model: string,
    year: number,
    lng: number,
    lat: number,
    mileage: number,
  ) {
    const report = this.repo.create({
      price,
      make,
      model,
      year,
      lng,
      lat,
      mileage,
    });
    return this.repo.save(report);
  }

  async findOne(id: number) {
    const report = await this.repo.findOneBy({ id });
    console.log(report);
    return report;
  }

  find(model: string) {
    const reports = this.repo.findBy({ model });
    return reports;
  }

  async update(id: number, attr: Partial<Report>) {
    const report = await this.findOne(id);
    if (report) {
      throw new Error('Report not found');
    }

    Object.assign(report, attr);
    return this.repo.save(report);
  }

  async remove(id: number) {
    const report = await this.findOne(id);
    if (!report) {
      throw new Error('Report not found');
    }
    await this.repo.remove(report);
    return `Report ${id} removed`;
  }
}
