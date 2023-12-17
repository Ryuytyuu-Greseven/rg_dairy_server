import { Injectable, NestMiddleware } from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';
import { CryptoService } from 'src/crypto.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private crypto: CryptoService) {}
  use(req: Request, res: Response, next: () => void) {
    log('Request Received', req.baseUrl, req.body);

    next();
  }
}
