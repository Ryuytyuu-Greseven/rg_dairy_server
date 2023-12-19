import { Injectable, NestMiddleware } from '@nestjs/common';
import { Integrations, init } from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { log } from 'console';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    log('Request Received', req.baseUrl, req.body);

    // sentry
    init({
      dsn: 'https://91f3c0802ab2a0f5e944f1a86426ad0e@o4506423188717568.ingest.sentry.io/4506423191863296',
      integrations: [
        // enable HTTP calls tracing
        new Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Integrations.Express({}),
        new ProfilingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,
    });

    next();
  }
}
