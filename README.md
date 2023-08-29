# NestJS Runtime Injector
## What is this?
This is a simple runtime injector for NestJS. It allows you to inject services into your classes at runtime. If you need this library, your project will become quite complex. I suggest you focus on another solution instead of using this library.

## Why?
I needed a way to inject services into classes that are not managed by NestJS. I couldn't find a way to do this, so I made this.

```typescript
class ConditionHell {
  constructor(
    private readonly testService: TestService,
    private readonly test2Service: Test2Service,
    private readonly test3Service: Test3Service,
    private readonly test4Service: Test4Service,
  ) {}

  getHello(): string {
    if (condition1 === true) {
      return this.testService.getHello();
    } else if (condition2 === true) {
      return this.test2Service.getHello();
    } else if (condition3 === true) {
      return this.test3Service.getHello();
    }
    return this.test4Service.getHello();
  }
}
```
To
```typescript
@Injectable()
export class AppService {
  constructor(
    private readonly runtimeInjectorService: RuntimeInjectorService,
  ) {}

  getHello(): string {
    return this.runtimeInjectorService.get(() => TestService).getHello();
  }
}
```

## How to use
This module is not use to global. You need to import it into the module you want to use it in.

### Installation
```bash
npm install nestjs-runtime-injector
```

### Usage
The logic is pretty simple, add the injector services to the module and then use it within that module.
#### App Module
```typescript
import { Injectable } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RuntimeInjectorModule } from './runtime-injector/runtime-injector.module';
import { TestService } from './modules/test/test.service';
import { Test2Service } from './modules/test/test2.service';

@Module({
  imports: [
    RuntimeInjectorModule.importServices([
      () => TestService,
      () => Test2Service,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
#### App Service
```typescript
import { Injectable } from '@nestjs/common';
import { RuntimeInjectorService } from './runtime-injector/runtime-injector.service';
import { TestService } from './modules/test/test.service';

@Injectable()
export class AppService {
  constructor(
    private readonly runtimeInjectorService: RuntimeInjectorService,
  ) {}

  getHello(): string {
    const defaultClass = () => TestService;
    // If all services are not injected, it will return the default class.
    return this.runtimeInjectorService.get(defaultClass).getHello();
  }
}
```
#### Test Service
```typescript
import { Injectable } from '@nestjs/common';
import { RuntimeInjectorInterface } from '../../runtime-injector/runtime-injector.interface';

@Injectable()
export class Test2Service implements RuntimeInjectorInterface {
  constructor() {}

  getHello(): string {
    return 'it works!';
  }

  call(name: string) {
    // do something, if this function return true, the service will be injected
    return true;
  }
}
```
