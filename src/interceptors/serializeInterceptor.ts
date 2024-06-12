import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../users/dtos/user.dto';

interface Classconstructor {
  new (...args: any): {};
}
export function Serialize(dto: Classconstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run somthing before a request is handled by the request handler
    //console.log("I'm running before the handler")

    return next.handle().pipe(
      map((data: any) => {
        //Run somthing before the response is sent out
        //console.log("I'm running before the response is sent out", data)
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
