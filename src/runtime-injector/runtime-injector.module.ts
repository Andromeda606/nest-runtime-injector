import { DynamicModule, Module } from '@nestjs/common';
import { RuntimeInjectorService } from './runtime-injector.service';
import { Logger } from '@nestjs/common';
import { RuntimeInjectorModuleOptions } from './runtime-injector.interface';

@Module({
  imports: [],
  controllers: [],
  providers: [RuntimeInjectorService],
})
export class RuntimeInjectorModule {
  static importServices({
    services,
    logLevel,
  }: RuntimeInjectorModuleOptions): DynamicModule {
    const providers = [...services];
    return {
      imports: [],
      module: RuntimeInjectorModule,
      controllers: [],
      exports: [RuntimeInjectorService],
      providers: [
        RuntimeInjectorService,
        ...services.map((service) => service()),
        {
          provide: RuntimeInjectorService.name,
          useFactory: (
            runtimeInjectorService: RuntimeInjectorService,
            ...services: (() => any)[]
          ) => {
            if (logLevel) {
              const logger = new Logger(RuntimeInjectorModule.name);
              logger[logLevel](
                'Started! Services: ' +
                  services
                    .map((service) => service.constructor.name)
                    .join(', '),
              );
            }
            runtimeInjectorService.serviceList = Object.assign(
              {},
              ...services.map((service, index) => ({
                [providers[index].toString()]: service,
              })),
            );
            return runtimeInjectorService;
          },
          inject: [
            RuntimeInjectorService,
            ...services.map((service) => service()),
          ],
        },
      ],
    };
  }
}
