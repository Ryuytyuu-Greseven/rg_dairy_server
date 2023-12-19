import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { captureException } from '@sentry/node';
import { log } from 'console';
import { CryptoService } from 'src/crypto.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    public readonly httpAdapterHost: HttpAdapterHost,
    private crypto: CryptoService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body = {
      statusCode: status,
      success: false,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: 'Unable to process right now!',
    };

    log('Exception', exception);
    captureException(exception);

    const cryptoData = this.crypto.encrypt(ctx.getRequest(), body);

    httpAdapter.reply(ctx.getResponse(), cryptoData, 200);
  }
}
