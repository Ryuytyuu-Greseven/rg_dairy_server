import { Injectable, NestMiddleware } from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    log('Request Received', req.baseUrl);
    next();
  }
}
