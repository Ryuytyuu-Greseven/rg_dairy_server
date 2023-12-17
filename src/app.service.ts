import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return `<p style="background:black;color:wheat">A CPU Listening</p>`;
  }
}
