import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<p style="background:black;color:wheat">Hello World!</p>`;
  }
}
