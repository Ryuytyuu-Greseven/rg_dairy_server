import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CryptoService } from 'src/crypto.service';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(private crypto: CryptoService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (request.method.toLowerCase() === 'post') {
      request.body = this.crypto.decrypt(request);
    }

    const now = Date.now();
    return next.handle().pipe(
      map((data: any) => {
        console.log(`After... ${data}`, request.url);
        if (request.url !== '/') {
          data = this.crypto.encrypt(request, data);
        }
        console.log('Final Response', data);
        return data;
      }),
    );
  }
}
