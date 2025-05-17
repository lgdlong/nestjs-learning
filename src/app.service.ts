import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>Hello World! Hoang Long Toi la ai?</h1>';
  }
}
